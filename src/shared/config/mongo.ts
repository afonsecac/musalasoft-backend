import { MongoClient, Db } from 'mongodb';
import * as R from 'ramda';

let db: Db;
export const initDatabaseConnection = async (): Promise<Db> => {
    if (R.isNil(db) || R.isEmpty(db)) {
        const url = `${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`;

        // @ts-ignore
        db = (await MongoClient.connect(url, { useNewUrlParser: true })).db();
    }

    return db;
};
