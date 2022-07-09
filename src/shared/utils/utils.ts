import * as R from 'ramda';

// @ts-ignore
export const removeEmptyOrNil = R.reject(R.isEmpty, R.isNil);
