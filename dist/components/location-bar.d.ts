import type { Components, JSX } from "../types/components";

interface LocationBar extends Components.LocationBar, HTMLElement {}
export const LocationBar: {
  prototype: LocationBar;
  new (): LocationBar;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
