import type { Components, JSX } from "../types/components";

interface HereDeepTime extends Components.HereDeepTime, HTMLElement {}
export const HereDeepTime: {
  prototype: HereDeepTime;
  new (): HereDeepTime;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
