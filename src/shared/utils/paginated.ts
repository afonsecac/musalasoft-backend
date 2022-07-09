import * as R from 'ramda';

const renameKeys = R.curry((keysMap, obj) =>
    R.reduce((acc, key) => R.assoc(keysMap[key] || key, obj[key], acc), {}, R.keys(obj))
);

export const renameIds = R.map(renameKeys({ _id: 'id' }))

// @ts-ignore
export const getSkipFromLimitAndPage = R.useWith(R.multiply, [R.identity, R.subtract(R.__, 1)]);

export const applyPaginationDefaults = R.mergeDeepRight({
    limit: 10,
    page: 1,
    sort: 'desc',
});

export const paginate = R.curry(({ limit, page, sort }, queryBuilder) => {
    queryBuilder.limit(limit);
    // @ts-ignore
    queryBuilder.offset(getSkipFromLimitAndPage(limit, page));
    queryBuilder.order('DATE', sort);
});

const getData = R.nth(2);
const getCount = R.nth(1);
// @ts-ignore
const getPage = R.compose(R.prop('page'), R.nth(0));
// @ts-ignore
const getLimit = R.compose(R.prop('limit'), R.nth(0));
// @ts-ignore
const getTotalPages = R.compose(Math.ceil, R.converge(R.divide, [getCount, getLimit]));

export const mapPaginationResult = R.applySpec({
    data: getData,
    pagination: {
        count: getCount,
        totalPages: getTotalPages,
        page: getPage,
        limit: getLimit,
    },
});

// @ts-ignore
export const toPaginatedResult = R.useWith(R.compose(mapPaginationResult, R.concat), [R.of, R.identity]);

export const findPaginated = R.curry((repository, options) => {
    if (!repository.getCount) return Promise.reject(new Error('`getCount` is not available on the repository'));
    if (!repository.findPaginated) return Promise.reject(new Error('`findPaginated` is not available on the repository'));

    const promises = [
        repository.getCount(options),
        repository.findPaginated(options),
    ];

    // @ts-ignore
    return Promise.all(promises).then(toPaginatedResult(options));
});
