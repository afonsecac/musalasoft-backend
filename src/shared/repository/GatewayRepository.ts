import {Db} from 'mongodb';
import * as R from 'ramda';

import { IRepository } from './IRepository';

import { IGateway } from '../interfaces/IGateway';
import { getSkipFromLimitAndPage, renameIds } from "../../shared/utils/paginated";
import { removeEmptyOrNil } from "../../shared/utils/utils";

const toMultiSelect = (field: string) => (query: any) => {
    const getFilters = R.compose(R.split(','), R.prop(field));

    return query[field]
        ? { $in: getFilters(query) }
        : undefined;
};

// @ts-ignore
const toDateObj = (toName: string) => R.ifElse(
    R.has(toName),
    R.compose(R.objOf('$lte')),
    R.F
);
// @ts-ignore
const fromDateObj = (fromName: string) => R.ifElse(
    R.has(fromName),
    R.compose(R.objOf('$gte')),
    R.F
);

// @ts-ignore
const convertDateRange = (fromName: string, toName: string) => R.converge(
    R.mergeRight, [fromDateObj(fromName), toDateObj(toName)]
);

const mappedFilters = R.applySpec({
    name: toMultiSelect('name'),
    ipV4: toMultiSelect('ipV4'),
    createdAt: convertDateRange('from', 'to'),
});

// @ts-ignore
const convertToMatchEq = (field: string, dbField: string) => R.ifElse(R.has(field),R.compose(
        R.objOf('$match'),
        R.objOf('$expr'),
        R.objOf('$eq'),
        R.pair(`$${dbField}`),
        R.prop(field)
    ),
    R.F
);

const applyFilters = R.juxt([
    convertToMatchEq('serialNumber', 'serialNumber')
]);

const transformFilters = R.compose(removeEmptyOrNil, mappedFilters);

export class GatewayRepository extends IRepository<IGateway> {

    constructor(db: Db) {
        super(db.collection('gateway'));
    }

    async save(object: IGateway): Promise<any> {
        try {
            let aggregate: any = [];
            aggregate = R.append({
                $match: {
                    serialNumber: object.serialNumber
                }
            }, aggregate);
            const gateways = await this.collection.aggregate(aggregate).toArray();
            if (gateways?.length > 0)
                throw new Error('A gateway with serial number already exists');

            return super.save(object);
        } catch (e) {
            throw e;
        }
    }

    async getCount(options: any): Promise<number> {
        const transformOptions = R.compose(transformFilters);
        const filters = transformOptions(options);
        const data = await this.collection
            .aggregate([
                { $match: filters },
                { $group: { _id: null, count: { $sum: 1 } } },
            ])
            .toArray();
        const getCount = R.compose(R.prop('count'), R.head);

        // @ts-ignore
        return getCount(data);
    }

    async findPaginated(options: any): Promise<any> {
        const omittedFields = ['date'];
        let aggregate: any = [];

        const { limit, page, sort } = options;

        const transformOptions = R.compose(transformFilters);

        aggregate = R.append({ $match: transformOptions(options) }, aggregate);

        if (!(R.isEmpty(sort) || R.isNil(sort))) {
            aggregate = R.append({ $sort: sort }, aggregate);
        }

        if (!(R.isEmpty(page) || R.isNil(page))) {
            // @ts-ignore
            aggregate = R.append({ $skip: getSkipFromLimitAndPage(limit, page) }, aggregate);
        }

        if (limit > 0) {
            aggregate = R.append({ $limit: parseInt(limit, 10) }, aggregate);
        }

        return await this.collection
            .aggregate(aggregate)
            .toArray()
            .then(R.map(R.omit(omittedFields)));
    }

    async findAll(options: any): Promise<any> {
        // const { limit, page, sort } = options;
        const aggregate: any = applyFilters(options).filter(Boolean);

        // if (!(R.isNil(limit) || R.isEmpty(limit) || R.isNil(page) || R.isEmpty(page))) {
        //     aggregate =
        // }

        // aggregate = R.append({ $match: transformFilters(options) }, aggregate);

        return  await this.collection
            .aggregate(aggregate)
            .toArray()
            .then(renameIds);
    }
}
