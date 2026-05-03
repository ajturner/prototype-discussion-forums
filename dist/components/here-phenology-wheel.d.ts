import type { Components, JSX } from "../types/components";

interface HerePhenologyWheel extends Components.HerePhenologyWheel, HTMLElement {}
export const HerePhenologyWheel: {
  prototype: HerePhenologyWheel;
  new (): HerePhenologyWheel;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
