import { EventEmitter } from '../../stencil-public-runtime';
import { Entity } from '../../types';
export declare class EntityCard {
  /** The organism entity to display */
  entity: Entity;
  /** Whether to show the card in a compact (inline) format */
  compact: boolean;
  /** Whether the card is currently selected/expanded */
  selected: boolean;
  /** Emitted when the card is clicked */
  cardSelect: EventEmitter<Entity>;
  imgError: boolean;
  private handleClick;
  private handleImgError;
  private getPhotoPlaceholder;
  render(): any;
}
