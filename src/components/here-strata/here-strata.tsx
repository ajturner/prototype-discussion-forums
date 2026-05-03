import { Component, Prop, State, h } from '@stencil/core';
import { StrataLayer, Entity } from '../../types';

@Component({
  tag: 'here-strata',
  styleUrl: 'here-strata.scss',
  shadow: true,
})
export class HereStrata {
  /** Ordered list of strata layers (sky → bedrock) */
  @Prop() layers: StrataLayer[] = [];

  /** Currently expanded layer key */
  @State() expandedLayer: string | null = null;

  /** Currently selected entity for the detail panel */
  @State() selectedEntity: Entity | null = null;

  private toggleLayer(key: string) {
    this.expandedLayer = this.expandedLayer === key ? null : key;
    this.selectedEntity = null;
  }

  private selectEntity(entity: Entity) {
    this.selectedEntity = this.selectedEntity?.id === entity.id ? null : entity;
  }

  private renderDepthRuler(layers: StrataLayer[]) {
    return (
      <div class="ruler" aria-hidden="true">
        {layers.map((layer, i) => (
          <div key={layer.key} class="ruler__mark" style={{ flex: String(i < 4 ? 1 : 1.2) }}>
            <span class="ruler__label">{layer.depthLabel}</span>
          </div>
        ))}
      </div>
    );
  }

  private renderEntityPanel(entity: Entity) {
    return (
      <div class="entity-panel" role="region" aria-label={entity.commonName}>
        <div class="entity-panel__header">
          <h3 class="entity-panel__name">{entity.commonName}</h3>
          <span class="entity-panel__sci">{entity.scientificName}</span>
          <button
            class="entity-panel__close"
            onClick={() => { this.selectedEntity = null; }}
            aria-label="Close entity details"
          >
            ✕
          </button>
        </div>
        {entity.status && (
          <p class="entity-panel__status">{entity.status}</p>
        )}
        {entity.dayPeakHour !== undefined && (
          <p class="entity-panel__meta">
            ⏰ Peak activity: {entity.dayPeakHour}:00
            {entity.dayDurationHours ? ` (±${Math.round(entity.dayDurationHours / 2)}h)` : ''}
          </p>
        )}
        {entity.phenologyCategory && (
          <p class="entity-panel__meta">
            🗓️ Phenology: {entity.phenologyCategory}
            {entity.phenologyPeakWeek ? ` · peak week ${entity.phenologyPeakWeek}` : ''}
          </p>
        )}
        {entity.iNatUrl && (
          <a
            class="entity-panel__link"
            href={entity.iNatUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on iNaturalist →
          </a>
        )}
      </div>
    );
  }

  render() {
    if (!this.layers || this.layers.length === 0) {
      return <div class="empty">No strata data available.</div>;
    }

    return (
      <div class="strata-view">
        <div class="strata-layout">
          {this.renderDepthRuler(this.layers)}

          <div class="strata-column" role="list">
            {this.layers.map(layer => {
              const isExpanded = this.expandedLayer === layer.key;
              return (
                <div
                  key={layer.key}
                  class={`layer ${isExpanded ? 'layer--expanded' : ''}`}
                  style={{ background: layer.color, color: layer.textColor }}
                  role="listitem"
                >
                  <button
                    class="layer__header"
                    style={{ background: layer.color, color: layer.textColor }}
                    onClick={() => this.toggleLayer(layer.key)}
                    aria-expanded={String(isExpanded)}
                    aria-controls={`layer-body-${layer.key}`}
                  >
                    <span class="layer__label">{layer.label}</span>
                    <div class="layer__entities-preview">
                      {layer.entities.slice(0, 5).map(e => (
                        <span key={e.id} class="layer__entity-chip">{e.commonName}</span>
                      ))}
                      {layer.entities.length > 5 && (
                        <span class="layer__entity-more">+{layer.entities.length - 5}</span>
                      )}
                    </div>
                    <span class="layer__toggle" aria-hidden="true">
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div class="layer__body" id={`layer-body-${layer.key}`}>
                      <p class="layer__description">{layer.description}</p>
                      <div class="layer__entity-list">
                        {layer.entities.map(entity => (
                          <button
                            key={entity.id}
                            class={`entity-btn ${this.selectedEntity?.id === entity.id ? 'entity-btn--selected' : ''}`}
                            onClick={() => this.selectEntity(entity)}
                          >
                            <span class="entity-btn__name">{entity.commonName}</span>
                            <span class="entity-btn__sci">{entity.scientificName}</span>
                          </button>
                        ))}
                      </div>

                      {this.selectedEntity && layer.entities.find(e => e.id === this.selectedEntity.id) && (
                        this.renderEntityPanel(this.selectedEntity)
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div class="strata-legend">
          <h4 class="strata-legend__title">Ecological Strata</h4>
          <p class="strata-legend__desc">
            Tap any layer to reveal the organisms living in that zone — from clouds to bedrock.
          </p>
        </div>
      </div>
    );
  }
}
