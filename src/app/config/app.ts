import { useExpressServer, useContainer } from 'routing-controllers';
import * as express from 'express';
import * as cors from 'cors';
import * as morgan from "morgan";
import { errors } from 'celebrate';

import { initDI } from './di';
import { register as registerSwagger } from './swagger';

const onListening = (server: any) => () => {
    const address = server.address();
    const bind = (typeof address === 'string') ? `pipe ${address}` : `port ${address.port}`;
    console.log(bind);
};

// @ts-ignore
export const onError = port => (error: any) => {
    if (error.syscall !== 'listen') throw error;
    const bind = (typeof port === 'string') ? `Pipe ${port}` : `Port ${port}`;
    /* tslint:disable */
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
    /* tslint:enable */
};

export const initServer = async () => {

    const container: any = await initDI();

    useContainer(container);

    const app = express();

    const originsWhitelist = [
        'http://localhost:4200',
        '*',
    ];

    const corsOptions = {
        origin: (origin: any, callback: any) => {
            const isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
            callback(null, isWhitelisted);
        },
        credentials: true,
    };

    app.use(cors(corsOptions));

    registerSwagger(app);

    app.use(morgan('common'));

    useExpressServer(app, {
        controllers: [`${__dirname}/../controllers/*{.ts,.js}`],
        classTransformer: true
    });

    app.use(errors());

    return app;
}

const port = process.env.PORT;

export const startApi = async () => {
    const server = await initServer();

    server.listen(port);
    // tslint:disable-next-line:no-shadowed-variable
    server.on('error', port => onError(port));
    server.on('listening', onListening(server));
};
