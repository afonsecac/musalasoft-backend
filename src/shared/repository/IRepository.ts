import {Collection} from 'mongodb';
import * as uuid from 'uuid';
import * as R from 'ramda';

const createInsertData = R.compose(R.mergeRight({ _id: uuid.v4(), createdAt: new Date() }))

export class IRepository<T> {
    protected collection: Collection;

    constructor(collection: Collection) {
        this.collection = collection;
    }

    async save(object: any): Promise<any> {
        const newObject = createInsertData(object);
        return await this.collection.insertOne(newObject);
    }
}
