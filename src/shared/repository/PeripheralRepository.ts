import { Db } from 'mongodb';
import * as R from 'ramda';

import { IRepository } from '../repository/IRepository';
import { IPeripheral } from '../interfaces/IPeripheral';
import { renameIds } from '../utils/paginated';

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
    convertToMatchEq('gatewayId', 'gatewayId'),
    convertToMatchEq('uid', 'uid')
]);

export class PeripheralRepository extends IRepository<IPeripheral> {

    constructor(db: Db) {
        super(db.collection('peripheral'));
    }

    async save(peripheral: IPeripheral): Promise<any> {
        try {
            const peripheralList: any[] = await this.findAll({
                gatewayId: peripheral.gatewayId
            });
            if (peripheralList.length > 9) {
                throw new Error('The peripheral list in this gateway is full');
            }

            return super.save(peripheral);
        } catch (e) {
            throw e;
        }
    }

    async findAll(options: any): Promise<any> {
        try {
            const aggregate: any = applyFilters(options).filter(Boolean);

            return await this.collection.aggregate(aggregate)
                .toArray()
                .then(renameIds);
        } catch (e) {
            throw e;
        }
    }
}
