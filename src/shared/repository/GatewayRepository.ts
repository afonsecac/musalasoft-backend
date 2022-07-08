import {Db} from 'mongodb';
import * as R from 'ramda';

import {IRepository} from './IRepository';

import {IGateway} from '../interfaces/IGateway';

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
}
