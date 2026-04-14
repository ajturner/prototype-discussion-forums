import { p as promiseResolve, b as bootstrapLazy } from './index-c205b8e2.js';
export { s as setNonce } from './index-c205b8e2.js';

/*
 Stencil Client Patch Browser v2.22.3 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = import.meta.url;
    const opts = {};
    if (importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    return promiseResolve(opts);
};

patchBrowser().then(options => {
  return bootstrapLazy([], options);
});

//# sourceMappingURL=hubdiscussionsextension.js.map