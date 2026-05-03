import { Component, Prop, State, h } from '@stencil/core';
import { DeepTimeEra } from '../../types';

@Component({
  tag: 'here-deep-time',
  styleUrl: 'here-deep-time.scss',
  shadow: true,
})
export class HereDeepTime {
  /** Ordered list of eras (present → oldest) */
  @Prop() eras: DeepTimeEra[] = [];

  /** Index of the currently focused era (0 = present) */
  @State() activeIndex: number = 0;

  private get activeEra(): DeepTimeEra | null {
    return this.eras[this.activeIndex] || null;
  }

  private handleScrub(e: Event) {
    const input = e.target as HTMLInputElement;
    this.activeIndex = Number(input.value);
  }

  private renderTimeline() {
    return (
      <div class="timeline">
        {this.eras.map((era, i) => (
          <button
            key={era.yearsAgoDisplay}
            class={`timeline__node ${i === this.activeIndex ? 'timeline__node--active' : ''}`}
            style={{ '--era-color': era.color } as any}
            onClick={() => { this.activeIndex = i; }}
            aria-label={`Jump to ${era.yearsAgoDisplay}`}
            aria-pressed={String(i === this.activeIndex)}
          >
            <span class="timeline__dot"></span>
            <span class="timeline__label">{era.yearsAgoDisplay}</span>
          </button>
        ))}
      </div>
    );
  }

  private renderEraContent(era: DeepTimeEra) {
    return (
      <div class="era-content" key={era.yearsAgoDisplay} style={{ '--era-color': era.color } as any}>
        <div class="era-content__header">
          <div class="era-content__badge">{era.yearsAgoDisplay}</div>
          <h2 class="era-content__environment">{era.environment}</h2>
        </div>

        <div class="era-content__illustration" aria-hidden="true">
          <div class="era-content__illustration-placeholder" style={{ background: era.color }}>
            {this.getEraEmoji(era)}
          </div>
        </div>

        <p class="era-content__narrative">{era.narrative}</p>

        {era.fossils && era.fossils.length > 0 && (
          <div class="era-content__fossils">
            <h4 class="era-content__fossils-title">Fossil Record</h4>
            <ul class="fossil-list">
              {era.fossils.map(f => (
                <li key={f.name} class="fossil-list__item">
                  <span class="fossil-list__name">{f.name}</span>
                  <span class="fossil-list__taxon">{f.taxon}</span>
                  <span class="fossil-list__age">{f.ageDisplay}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div class="era-content__sources">
          <span class="era-content__source-label">Data sources:</span>
          <a
            class="era-content__source-link"
            href={`https://macrostrat.org/map#x=${-122.06}&y=${37.56}&z=10`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Macrostrat
          </a>
          {era.fossils.length > 0 && (
            <a
              class="era-content__source-link"
              href={`https://paleobiodb.org/classic/displayCollResults?lngmin=-122.5&lngmax=-121.5&latmin=37.0&latmax=38.0`}
              target="_blank"
              rel="noopener noreferrer"
            >
              PBDB
            </a>
          )}
        </div>
      </div>
    );
  }

  private getEraEmoji(era: DeepTimeEra): string {
    if (era.yearsAgo === 0) return '🌿';
    if (era.yearsAgo <= 15000) return '🦌';
    if (era.yearsAgo <= 150000) return '🦣';
    if (era.yearsAgo <= 1500000) return '🐺';
    if (era.yearsAgo <= 15000000) return '🦏';
    if (era.yearsAgo <= 150000000) return '🦕';
    return '🐚';
  }

  render() {
    if (!this.eras || this.eras.length === 0) {
      return <div class="empty">No deep time data available.</div>;
    }

    const era = this.activeEra;

    return (
      <div class="deep-time-view">
        <div class="deep-time-layout">

          {/* Vertical timeline scrubber */}
          <div class="scrubber-panel">
            <div class="scrubber-label scrubber-label--top">TODAY</div>
            <input
              type="range"
              class="scrubber"
              min="0"
              max={String(this.eras.length - 1)}
              step="1"
              value={String(this.activeIndex)}
              aria-label="Time scrubber"
              onInput={this.handleScrub.bind(this)}
            />
            <div class="scrubber-label scrubber-label--bottom">500 Mya</div>
            {this.renderTimeline()}
          </div>

          {/* Era content panel */}
          <div class="content-panel">
            {era && this.renderEraContent(era)}
          </div>

        </div>

        {/* Navigation arrows */}
        <div class="era-nav">
          <button
            class="era-nav__btn"
            disabled={this.activeIndex === 0}
            onClick={() => { if (this.activeIndex > 0) this.activeIndex--; }}
            aria-label="Go to more recent era"
          >
            ↑ More recent
          </button>
          <span class="era-nav__divider">|</span>
          <button
            class="era-nav__btn"
            disabled={this.activeIndex === this.eras.length - 1}
            onClick={() => { if (this.activeIndex < this.eras.length - 1) this.activeIndex++; }}
            aria-label="Go to older era"
          >
            Older ↓
          </button>
        </div>
      </div>
    );
  }
}
