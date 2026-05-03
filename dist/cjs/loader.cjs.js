'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-1a18ff50.js');

/*
 Stencil Client Patch Esm v2.22.3 | MIT Licensed | https://stenciljs.com
 */
const patchEsm = () => {
    return index.promiseResolve();
};

const defineCustomElements = (win, options) => {
  if (typeof window === 'undefined') return Promise.resolve();
  return patchEsm().then(() => {
  return index.bootstrapLazy([["entity-card.cjs",[[1,"entity-card",{"entity":[16],"compact":[4],"selected":[4],"imgError":[32]}]]],["here-day-wheel_7.cjs",[[1,"here-view",{"activeMode":[32],"locationContext":[32],"loading":[32]}],[1,"here-day-wheel",{"entities":[16],"localTime":[16],"selectedEntity":[32],"hoveredHour":[32]}],[1,"here-deep-time",{"eras":[16],"activeIndex":[32]}],[1,"here-mode-switcher",{"activeMode":[1,"active-mode"]}],[1,"here-phenology-wheel",{"entities":[16],"currentWeek":[2,"current-week"],"selectedEntity":[32],"activeFilters":[32]}],[1,"here-strata",{"layers":[16],"expandedLayer":[32],"selectedEntity":[32]}],[1,"location-bar",{"context":[16]}]]]], options);
  });
};

exports.setNonce = index.setNonce;
exports.defineCustomElements = defineCustomElements;

//# sourceMappingURL=loader.cjs.js.map