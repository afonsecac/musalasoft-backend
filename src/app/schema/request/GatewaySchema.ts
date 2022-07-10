import * as types from 'joi';

const gateway = {
    name: types.string().required(),
    serialNumber: types.number().required(),
    ipV4: types.string()
        .regex(new RegExp(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/))
        .required()
};

const gatewayUpdate = {
    id: types.string().required(),
    name: types.string().optional(),
    serialNumber: types.number().optional(),
    ipV4: types.string()
        .regex(new RegExp(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/))
        .optional()
}

export const gatewaySchemaIn = {
    body: types.object().keys(gateway)
}

export const gatewaySchemaUpdate = {
    body: types.object().keys(gatewayUpdate)
}

export const findAllGateway = {
    query: types.object().keys({
        createdAt: types.date().optional(),
        name: types.string().optional(),
        serialNumber: types.number().optional(),
        ipV4: types.string()
            .regex(new RegExp(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/))
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
