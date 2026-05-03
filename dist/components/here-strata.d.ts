import type { Components, JSX } from "../types/components";

interface HereStrata extends Components.HereStrata, HTMLElement {}
export const HereStrata: {
  prototype: HereStrata;
  new (): HereStrata;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
