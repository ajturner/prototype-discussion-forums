import { p as promiseResolve, b as bootstrapLazy } from './index-6e87a848.js';
export { s as setNonce } from './index-6e87a848.js';

/*
 Stencil Client Patch Esm v2.22.3 | MIT Licensed | https://stenciljs.com
 */
const patchEsm = () => {
    return promiseResolve();
};

const defineCustomElements = (win, options) => {
  if (typeof window === 'undefined') return Promise.resolve();
  return patchEsm().then(() => {
  return bootstrapLazy([["entity-card",[[1,"entity-card",{"entity":[16],"compact":[4],"selected":[4],"imgError":[32]}]]],["here-day-wheel_7",[[1,"here-view",{"activeMode":[32],"locationContext":[32],"loading":[32]}],[1,"here-day-wheel",{"entities":[16],"localTime":[16],"selectedEntity":[32],"hoveredHour":[32]}],[1,"here-deep-time",{"eras":[16],"activeIndex":[32]}],[1,"here-mode-switcher",{"activeMode":[1,"active-mode"]}],[1,"here-phenology-wheel",{"entities":[16],"currentWeek":[2,"current-week"],"selectedEntity":[32],"activeFilters":[32]}],[1,"here-strata",{"layers":[16],"expandedLayer":[32],"selectedEntity":[32]}],[1,"location-bar",{"context":[16]}]]]], options);
  });
};

export { defineCustomElements };

//# sourceMappingURL=loader.js.map