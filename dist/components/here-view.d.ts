import type { Components, JSX } from "../types/components";

interface HereView extends Components.HereView, HTMLElement {}
export const HereView: {
  prototype: HereView;
  new (): HereView;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
