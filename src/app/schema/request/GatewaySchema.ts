import * as types from 'joi';

const gateway = {
    name: types.string().required(),
    serialNumber: types.string().required(),
    ipV4: types.string().optional()
};

export const gatewaySchemaIn = {
    body: types.object().keys(gateway)
}

export const findAllGateway = {
    query: types.object().keys({
        createdAt: types.date().optional(),
        name: types.string().optional(),
        serialNumber: types.string().optional(),
        ipV4: types.string().optional(),
        sort: types.string()
            .optional()
            .default('-createdAt')
            .description('Sort order')
            .example('-createdAt'),
        limit: types.number().default(10),
        page: types.number().default(0)
    })
}
