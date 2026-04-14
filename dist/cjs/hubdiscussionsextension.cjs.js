'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-a34fb4e6.js');

/*
 Stencil Client Patch Browser v2.22.3 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('hubdiscussionsextension.cjs.js', document.baseURI).href));
    const opts = {};
    if (importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    return index.promiseResolve(opts);
};

patchBrowser().then(options => {
  return index.bootstrapLazy([], options);
});

exports.setNonce = index.setNonce;

//# sourceMappingURL=hubdiscussionsextension.cjs.js.map