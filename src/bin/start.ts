import * as dotEnv from 'dotenv-safe';
import * as R from 'ramda';

dotEnv.config();

import { startApi } from '../app/config/app';



const run = R.pipe(
    startApi
);

switch (process.env.START_APP) {
    case 'api':
        startApi();
        break;

    default:
        run();
        break;
}
