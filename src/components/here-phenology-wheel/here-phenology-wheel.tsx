import { Component, Prop, State, h } from '@stencil/core';
import { Entity, PhenologyCategory } from '../../types';

const CATEGORY_COLORS: Record<PhenologyCategory, string> = {
  bloom: '#ffd600',
  migration: '#2196f3',
  breed: '#f44336',
  fruit: '#ff9800',
  hibernate: '#9e9e9e',
  emerge: '#4caf50',
};

const CATEGORY_RADII: Record<PhenologyCategory, [number, number]> = {
  // [innerR, outerR] for each band
  bloom: [120, 142],
  migration: [146, 168],
  breed: [172, 194],
  fruit: [92, 114],
  hibernate: [64, 86],
  emerge: [38, 60],
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function weekToAngle(week: number): number {
  // Week 1 starts at top (-PI/2); increases clockwise
  return ((week - 1) / 52) * 2 * Math.PI - Math.PI / 2;
}

function polar(cx: number, cy: number, r: number, angle: number): { x: number; y: number } {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function donutArc(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startWeek: number,
  endWeek: number,
  wrapAround = false,
): string {
  let sa = weekToAngle(startWeek);
  let ea = weekToAngle(endWeek);

  // Wrap-around entries (e.g., toyon: Nov–Feb) — span across year boundary
  if (wrapAround) {
    ea = weekToAngle(endWeek + 52);
  }

  const span = ea - sa;
  const large = span > Math.PI ? 1 : 0;

  const o1 = polar(cx, cy, outerR, sa);
  const o2 = polar(cx, cy, outerR, ea);
  const i1 = polar(cx, cy, innerR, sa);
  const i2 = polar(cx, cy, innerR, ea);

  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

@Component({
  tag: 'here-phenology-wheel',
  styleUrl: 'here-phenology-wheel.scss',
  shadow: true,
})
export class HerePhenologyWheel {
  /** Entities with phenology information */
  @Prop() entities: Entity[] = [];

  /** Current week of year (1-52) */
  @Prop() currentWeek: number = 1;

  /** Selected entity */
  @State() selectedEntity: Entity | null = null;

  /** Active category filters (empty = show all) */
  @State() activeFilters: Set<PhenologyCategory> = new Set();

  private toggleFilter(cat: PhenologyCategory) {
    const next = new Set(this.activeFilters);
    if (next.has(cat)) {
      next.delete(cat);
    } else {
      next.add(cat);
    }
    this.activeFilters = next;
  }

  private isVisible(entity: Entity): boolean {
    if (this.activeFilters.size === 0) return true;
    return this.activeFilters.has(entity.phenologyCategory);
  }

  private renderMonthLabels(cx: number, cy: number, r: number) {
    return MONTH_LABELS.map((label, i) => {
      // Month i starts at week (i * 52/12) + 1
      const midWeek = (i * 52) / 12 + 52 / 24 + 1;
      const angle = weekToAngle(midWeek);
      const pos = polar(cx, cy, r, angle);
      return (
        <text
          key={`month-${i}`}
          x={pos.x.toFixed(2)}
          y={pos.y.toFixed(2)}
          text-anchor="middle"
          dominant-baseline="central"
          font-size="9"
          fill="rgba(255,255,255,0.55)"
          font-family="sans-serif"
        >
          {label}
        </text>
      );
    });
  }

  private renderCurrentWeekSlice(cx: number, cy: number, innerR: number, outerR: number) {
    const sa = weekToAngle(this.currentWeek);
    const ea = weekToAngle(this.currentWeek + 1);
    const o1 = polar(cx, cy, outerR, sa);
    const o2 = polar(cx, cy, outerR, ea);
    const i1 = polar(cx, cy, innerR, sa);
    const i2 = polar(cx, cy, innerR, ea);
    const path = [
      `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
      `A ${outerR} ${outerR} 0 0 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
      `L ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
      `A ${innerR} ${innerR} 0 0 0 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
      'Z',
    ].join(' ');
    return <path d={path} fill="rgba(255,255,255,0.18)" stroke="white" stroke-width="1.5" />;
  }

  private renderEntityArcs(cx: number, cy: number) {
    return this.entities
      .filter(e => e.phenologyCategory && e.phenologyStartWeek && e.phenologyEndWeek && this.isVisible(e))
      .map(entity => {
        const [innerR, outerR] = CATEGORY_RADII[entity.phenologyCategory];
        const color = CATEGORY_COLORS[entity.phenologyCategory];
        const wraps = entity.phenologyEndWeek < entity.phenologyStartWeek;
        const d = donutArc(cx, cy, innerR, outerR, entity.phenologyStartWeek, entity.phenologyEndWeek, wraps);
        const isSelected = this.selectedEntity?.id === entity.id;
        return (
          <path
            key={entity.id}
            d={d}
            fill={color}
            opacity={isSelected ? 1 : 0.65}
            stroke={isSelected ? 'white' : 'transparent'}
            stroke-width={isSelected ? '2' : '0'}
            class="entity-arc"
            onClick={() => { this.selectedEntity = this.selectedEntity?.id === entity.id ? null : entity; }}
            aria-label={entity.commonName}
            role="button"
          />
        );
      });
  }

  private renderCenterSummary(cx: number, cy: number, _innerR: number) {
    const active = this.entities.filter(e => {
      if (!e.phenologyStartWeek || !e.phenologyEndWeek || !this.isVisible(e)) return false;
      const wraps = e.phenologyEndWeek < e.phenologyStartWeek;
      if (wraps) {
        return this.currentWeek >= e.phenologyStartWeek || this.currentWeek <= e.phenologyEndWeek;
      }
      return this.currentWeek >= e.phenologyStartWeek && this.currentWeek <= e.phenologyEndWeek;
    });

    return (
      <g>
        <text
          x={cx.toFixed(2)} y={(cy - 18).toFixed(2)}
          text-anchor="middle"
          font-size="22"
          font-weight="700"
          fill="#ffffff"
          font-family="sans-serif"
        >
          Wk {this.currentWeek}
        </text>
        <text
          x={cx.toFixed(2)} y={(cy + 4).toFixed(2)}
          text-anchor="middle"
          font-size="10"
          fill="rgba(255,255,255,0.6)"
          font-family="sans-serif"
        >
          {active.length} active
        </text>
        <text
          x={cx.toFixed(2)} y={(cy + 18).toFixed(2)}
          text-anchor="middle"
          font-size="9"
          fill="rgba(255,255,255,0.35)"
          font-family="sans-serif"
        >
          this week
        </text>
      </g>
    );
  }

  render() {
    const cx = 250, cy = 250;
    const svgSize = 500;
    const outerMost = 210;
    const innerMost = 30;
    const labelR = 228;

    return (
      <div class="phenology-view">

        {/* Category filter pills */}
        <div class="filters">
          {(Object.keys(CATEGORY_COLORS) as PhenologyCategory[]).map(cat => (
            <button
              key={cat}
              class={`filter-pill ${this.activeFilters.has(cat) ? 'filter-pill--active' : ''}`}
              style={{ '--cat-color': CATEGORY_COLORS[cat] } as any}
              onClick={() => this.toggleFilter(cat)}
              aria-pressed={String(this.activeFilters.has(cat))}
            >
              {cat}
            </button>
          ))}
        </div>

        <div class="wheel-container">
          <svg
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            class="wheel-svg"
            role="img"
            aria-label="Phenology wheel showing seasonal activity across the year"
          >
            <title>Annual phenology wheel: each arc shows when organisms bloom, migrate, breed, fruit, hibernate, or emerge</title>

            {/* Background */}
            <circle cx={cx} cy={cy} r={outerMost + 8} fill="#0d1f2d" />

            {/* Band backgrounds (subtle rings per category) */}
            {(Object.entries(CATEGORY_RADII) as [PhenologyCategory, [number, number]][]).map(([cat, [ir, or_]]) => (
              <circle
                key={`bg-${cat}`}
                cx={cx} cy={cy}
                r={(ir + or_) / 2}
                fill="none"
                stroke={CATEGORY_COLORS[cat]}
                stroke-width={(or_ - ir).toString()}
                opacity="0.07"
              />
            ))}

            {/* Entity arcs */}
            {this.renderEntityArcs(cx, cy)}

            {/* Current week highlight */}
            {this.renderCurrentWeekSlice(cx, cy, innerMost, outerMost)}

            {/* Month labels */}
            {this.renderMonthLabels(cx, cy, labelR)}

            {/* Inner circle */}
            <circle cx={cx} cy={cy} r={innerMost - 2} fill="#0d1f2d" />

            {/* Center summary */}
            {this.renderCenterSummary(cx, cy, innerMost)}
          </svg>
        </div>

        {/* Legend */}
        <div class="legend">
          {(Object.entries(CATEGORY_COLORS) as [PhenologyCategory, string][]).map(([cat, color]) => (
            <div key={cat} class="legend__item">
              <span class="legend__swatch" style={{ background: color }}></span>
              <span class="legend__label">{cat}</span>
            </div>
          ))}
        </div>

        {/* Selected entity detail */}
        {this.selectedEntity && (
          <div class="detail-panel">
            <div class="detail-panel__header">
              <div class="detail-panel__cat-dot" style={{ background: CATEGORY_COLORS[this.selectedEntity.phenologyCategory] }}></div>
              <h3>{this.selectedEntity.commonName}</h3>
              <span class="detail-panel__sci">{this.selectedEntity.scientificName}</span>
              <button class="detail-panel__close" onClick={() => { this.selectedEntity = null; }}>✕</button>
            </div>
            <p class="detail-panel__meta">
              Category: <strong>{this.selectedEntity.phenologyCategory}</strong>
              {this.selectedEntity.phenologyPeakWeek && ` · Peak: week ${this.selectedEntity.phenologyPeakWeek}`}
            </p>
            {this.selectedEntity.phenologyStartWeek && this.selectedEntity.phenologyEndWeek && (
              <p class="detail-panel__meta">
                Season: weeks {this.selectedEntity.phenologyStartWeek}–{this.selectedEntity.phenologyEndWeek}
              </p>
            )}
            {this.selectedEntity.iNatUrl && (
              <a href={this.selectedEntity.iNatUrl} target="_blank" rel="noopener noreferrer" class="detail-panel__link">
                View on iNaturalist →
              </a>
            )}
          </div>
        )}

        {/* Active this week */}
        <div class="active-now">
          <h4 class="active-now__title">Active this week (week {this.currentWeek})</h4>
          <div class="active-now__list">
            {this.entities
              .filter(e => {
                if (!e.phenologyStartWeek || !e.phenologyEndWeek || !this.isVisible(e)) return false;
                const wraps = e.phenologyEndWeek < e.phenologyStartWeek;
                if (wraps) {
                  return this.currentWeek >= e.phenologyStartWeek || this.currentWeek <= e.phenologyEndWeek;
                }
                return this.currentWeek >= e.phenologyStartWeek && this.currentWeek <= e.phenologyEndWeek;
              })
              .map(e => (
                <button
                  key={e.id}
                  class={`active-chip ${this.selectedEntity?.id === e.id ? 'active-chip--selected' : ''}`}
                  style={{ '--cat-color': CATEGORY_COLORS[e.phenologyCategory] } as any}
                  onClick={() => { this.selectedEntity = this.selectedEntity?.id === e.id ? null : e; }}
                >
                  {e.commonName}
                </button>
              ))
            }
          </div>
        </div>
      </div>
    );
  }
}
