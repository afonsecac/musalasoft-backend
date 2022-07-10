import * as types from 'joi';


const peripheral = {
    id: types.string().optional(),
    uid: types.number().required(),
    vendor: types.string().required(),
    status: types.string()
        .regex(new RegExp(/^online|offline$/))
        .required()
        .default('online'),
    gatewayId: types.string().required()
}

const peripheralUpdated = {
    id: types.string().optional(),
    uid: types.string().optional(),
    vendor: types.string().optional(),
    status: types.string()
        .regex(new RegExp(/^online|offline$/))
        .optional()
        .default('online')
        .description('Status values: online/offline')
        .example('offline'),
    gatewayId: types.string().optional()
}

export const peripheralSchemaIn = {
    body: types.object().keys(peripheral)
}

export const peripheralSchemaUp = {
    body: types.object().keys(peripheralUpdated)
};

export const findAllPeripheral = {
    query: types.object().keys({
        createdAt: types.date().optional(),
        uid: types.number().optional(),
        vendor: types.string().optional(),
        gatewayId: types.string().optional(),
        status: types.string()
            .regex(new RegExp(/^online|offline$/))
            .optional(),
        sort: types.string()
            .optional()
            .default('-createdAt')
            .description('Sort order')
            .example('-createdAt'),
        limit: types.number().default(10),
        page: types.number().default(1)
    })
}
