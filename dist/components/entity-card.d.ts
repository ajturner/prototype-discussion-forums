import type { Components, JSX } from "../types/components";

interface EntityCard extends Components.EntityCard, HTMLElement {}
export const EntityCard: {
  prototype: EntityCard;
  new (): EntityCard;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
