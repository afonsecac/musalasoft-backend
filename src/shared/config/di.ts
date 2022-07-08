import * as R from 'ramda';
import { sync } from 'glob';
import { createContainer as createAwContainer } from 'awilix';

// @ts-ignore
const createLoadModules = container => dirPath =>
    container.loadModules(dirPath, { formatName: (name: string, descriptor: any) => R.or(descriptor.value.name, name) });

// @ts-ignore
const createInjector = container => globPattern =>
    sync(globPattern)
        .map(require)
        .map(R.prop('default'))
        .map(container.build);

export const createContainer = (opts = {}) => {
    const container = createAwContainer(opts);

    return {
        container,
        loadModules: createLoadModules(container),
        injectContainer: createInjector(container),
    };
};
