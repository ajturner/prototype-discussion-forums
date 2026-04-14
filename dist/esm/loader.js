import { p as promiseResolve, b as bootstrapLazy } from './index-c205b8e2.js';
export { s as setNonce } from './index-c205b8e2.js';

/*
 Stencil Client Patch Esm v2.22.3 | MIT Licensed | https://stenciljs.com
 */
const patchEsm = () => {
    return promiseResolve();
};

const defineCustomElements = (win, options) => {
  if (typeof window === 'undefined') return Promise.resolve();
  return patchEsm().then(() => {
  return bootstrapLazy([], options);
  });
};

export { defineCustomElements };

//# sourceMappingURL=loader.js.map