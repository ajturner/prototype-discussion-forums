import { Component, Prop, State, Event, EventEmitter, h } from '@stencil/core';
import { Entity } from '../../types';

@Component({
  tag: 'entity-card',
  styleUrl: 'entity-card.scss',
  shadow: true,
})
export class EntityCard {
  /** The organism entity to display */
  @Prop() entity: Entity;

  /** Whether to show the card in a compact (inline) format */
  @Prop() compact: boolean = false;

  /** Whether the card is currently selected/expanded */
  @Prop() selected: boolean = false;

  /** Emitted when the card is clicked */
  @Event() cardSelect: EventEmitter<Entity>;

  @State() imgError: boolean = false;

  private handleClick = () => {
    this.cardSelect.emit(this.entity);
  };

  private handleImgError = () => {
    this.imgError = true;
  };

  private getPhotoPlaceholder(entity: Entity): string {
    // Return an emoji placeholder based on strataLayer
    const placeholders: Record<string, string> = {
      atmosphere: '🦅',
      canopy: '🦜',
      understory: '🌿',
      ground: '🌺',
      'soil-surface': '🍄',
      'upper-soil': '🪱',
      mycorrhizal: '🕸️',
      bedrock: '🪨',
    };
    if (entity.strataLayer && placeholders[entity.strataLayer]) {
      return placeholders[entity.strataLayer];
    }
    if (entity.phenologyCategory) {
      const cat: Record<string, string> = {
        bloom: '🌸',
        migration: '🦋',
        breed: '🥚',
        fruit: '🍎',
        hibernate: '💤',
        emerge: '🌱',
      };
      return cat[entity.phenologyCategory] || '🌿';
    }
    return '🔍';
  }

  render() {
    if (!this.entity) return null;
    const { commonName, scientificName, status, photoUrl, iNatUrl } = this.entity;
    const placeholder = this.getPhotoPlaceholder(this.entity);

    if (this.compact) {
      return (
        <button
          class={`card card--compact ${this.selected ? 'card--selected' : ''}`}
          onClick={this.handleClick}
          aria-label={commonName}
        >
          <span class="card__photo-mini">
            {photoUrl && !this.imgError ? (
              <img src={photoUrl} alt={commonName} onError={this.handleImgError} />
            ) : (
              <span class="placeholder">{placeholder}</span>
            )}
          </span>
          <span class="card__name-mini">{commonName}</span>
        </button>
      );
    }

    return (
      <div
        class={`card ${this.selected ? 'card--selected' : ''}`}
        onClick={this.handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && this.handleClick()}
        aria-label={`View details for ${commonName}`}
      >
        <div class="card__photo">
          {photoUrl && !this.imgError ? (
            <img src={photoUrl} alt={commonName} onError={this.handleImgError} />
          ) : (
            <span class="placeholder">{placeholder}</span>
          )}
        </div>
        <div class="card__body">
          <div class="card__names">
            <span class="card__common">{commonName}</span>
            <span class="card__scientific">{scientificName}</span>
          </div>
          {status && <div class="card__status">{status}</div>}
          {iNatUrl && (
            <a
              class="card__link"
              href={iNatUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
            >
              View on iNaturalist →
            </a>
          )}
        </div>
      </div>
    );
  }
}
