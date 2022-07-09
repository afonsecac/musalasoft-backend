import {Collection} from 'mongodb';
import * as uuid from 'uuid';
import * as R from 'ramda';

const createInsertData = R.compose(R.mergeRight({ _id: uuid.v4(), createdAt: new Date() }));
const updateInsertData = R.compose(R.mergeRight({ updatedAt: new Date() }), R.omit(['id']));

export class IRepository<T> {
    protected collection: Collection;

    constructor(collection: Collection) {
        this.collection = collection;
    }

    async save(object: any): Promise<any> {
        const newObject = createInsertData(object);
        return await this.collection.insertOne(newObject);
    }

    async update(object: any): Promise<any> {
        const currentObject = updateInsertData(object);
        return await this.collection.updateOne({
            _id: object.id
        }, {
            $set: currentObject
        });
    }

    async findById(id: string): Promise<any> {
        return this.collection.findOne({
            _id: id
        });
    }

    async deleteObject(id: string): Promise<any> {
        return await this.collection.deleteOne({
            _id: id
        })
    }
}
