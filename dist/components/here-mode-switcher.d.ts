import type { Components, JSX } from "../types/components";

interface HereModeSwitcher extends Components.HereModeSwitcher, HTMLElement {}
export const HereModeSwitcher: {
  prototype: HereModeSwitcher;
  new (): HereModeSwitcher;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
