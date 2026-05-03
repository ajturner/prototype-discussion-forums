import type { Components, JSX } from "../types/components";

interface HereDayWheel extends Components.HereDayWheel, HTMLElement {}
export const HereDayWheel: {
  prototype: HereDayWheel;
  new (): HereDayWheel;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
