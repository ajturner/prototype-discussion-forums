import { Component, Prop, State, h } from '@stencil/core';
import { Entity } from '../../types';

/** Returns the SVG angle (radians) for a given hour (0-23), with midnight at top */
function hourToAngle(hour: number, minute: number = 0): number {
  return ((hour + minute / 60) / 24) * 2 * Math.PI - Math.PI / 2;
}

/** Convert polar coordinates to Cartesian */
function polar(cx: number, cy: number, r: number, angle: number): { x: number; y: number } {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

/** Build an SVG donut segment path for a time range (hours, 0-24) */
function donutSegment(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startHour: number,
  endHour: number,
): string {
  const sa = hourToAngle(startHour);
  const ea = hourToAngle(endHour);
  const large = endHour - startHour > 12 ? 1 : 0;
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

/** Color for each hour segment based on light level */
function hourColor(hour: number): string {
  if (hour >= 0 && hour < 4) return '#0a1628';   // Deep night
  if (hour >= 4 && hour < 6) return '#1a2a4a';   // Pre-dawn
  if (hour >= 6 && hour < 8) return '#bf5a2e';   // Dawn
  if (hour >= 8 && hour < 11) return '#87ceeb';  // Morning
  if (hour >= 11 && hour < 15) return '#4fc3f7'; // Midday
  if (hour >= 15 && hour < 18) return '#f9a825'; // Afternoon
  if (hour >= 18 && hour < 20) return '#e64a19'; // Dusk
  if (hour >= 20 && hour < 22) return '#4a148c'; // Evening
  return '#0a1628';                               // Night
}

@Component({
  tag: 'here-day-wheel',
  styleUrl: 'here-day-wheel.scss',
  shadow: true,
})
export class HereDayWheel {
  /** Entities with peak activity hours */
  @Prop() entities: Entity[] = [];

  /** Current local time */
  @Prop() localTime: Date;

  /** Selected entity for detail panel */
  @State() selectedEntity: Entity | null = null;

  /** Hovered hour for tooltip */
  @State() hoveredHour: number | null = null;

  private get now(): Date {
    return this.localTime || new Date();
  }

  private handleEntityClick(entity: Entity) {
    this.selectedEntity = this.selectedEntity?.id === entity.id ? null : entity;
  }

  private renderNowHand(cx: number, cy: number, _innerR: number, outerR: number) {
    const now = this.now;
    const angle = hourToAngle(now.getHours(), now.getMinutes());
    const outer = polar(cx, cy, outerR + 14, angle);
    return (
      <line
        x1={cx.toFixed(2)} y1={cy.toFixed(2)}
        x2={outer.x.toFixed(2)} y2={outer.y.toFixed(2)}
        stroke="#f44336"
        stroke-width="2.5"
        stroke-linecap="round"
        opacity="0.9"
      />
    );
  }

  private renderHourLabels(cx: number, cy: number, r: number) {
    const labels = [0, 3, 6, 9, 12, 15, 18, 21];
    return labels.map(hr => {
      const angle = hourToAngle(hr);
      const pos = polar(cx, cy, r, angle);
      return (
        <text
          key={`lbl-${hr}`}
          x={pos.x.toFixed(2)}
          y={pos.y.toFixed(2)}
          text-anchor="middle"
          dominant-baseline="central"
          font-size="11"
          fill="rgba(255,255,255,0.6)"
          font-family="sans-serif"
        >
          {hr === 0 ? '12am' : hr === 12 ? '12pm' : hr < 12 ? `${hr}am` : `${hr - 12}pm`}
        </text>
      );
    });
  }

  private renderEntityMarkers(cx: number, cy: number, markerR: number) {
    const placed = new Map<string, number>(); // hour → count for stagger
    return this.entities
      .filter(e => e.dayPeakHour !== undefined)
      .map(entity => {
        const hour = entity.dayPeakHour;
        const key = String(hour);
        const offset = placed.get(key) || 0;
        placed.set(key, offset + 1);

        // Slightly stagger entities at the same hour
        const angle = hourToAngle(hour, offset * 12);
        const r = markerR + offset * 10;
        const pos = polar(cx, cy, r, angle);
        const isSelected = this.selectedEntity?.id === entity.id;

        return (
          <g
            key={entity.id}
            class="entity-marker"
            onClick={() => this.handleEntityClick(entity)}
            role="button"
            aria-label={`${entity.commonName}, peak ${hour}:00`}
          >
            <circle
              cx={pos.x.toFixed(2)}
              cy={pos.y.toFixed(2)}
              r={isSelected ? '12' : '9'}
              fill={isSelected ? '#f44336' : 'rgba(255,255,255,0.85)'}
              stroke={isSelected ? '#b71c1c' : 'rgba(0,0,0,0.3)'}
              stroke-width="1"
              class="entity-marker__dot"
            />
            <text
              x={pos.x.toFixed(2)}
              y={pos.y.toFixed(2)}
              text-anchor="middle"
              dominant-baseline="central"
              font-size={isSelected ? '11' : '9'}
              fill={isSelected ? '#fff' : '#333'}
              style={{ pointerEvents: 'none' }}
            >
              {entity.commonName.charAt(0)}
            </text>
          </g>
        );
      });
  }

  private renderCenterInfo(cx: number, cy: number, _innerR: number) {
    const now = this.now;
    const hours = now.getHours();
    const mins = now.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'pm' : 'am';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    // Find entities active near now
    const activeNow = this.entities.filter(e => {
      if (e.dayPeakHour === undefined) return false;
      const dur = e.dayDurationHours || 3;
      const diff = Math.abs(e.dayPeakHour - hours);
      return diff <= dur / 2 || diff >= (24 - dur / 2);
    });

    return (
      <g>
        <text
          x={cx.toFixed(2)} y={(cy - 16).toFixed(2)}
          text-anchor="middle"
          dominant-baseline="central"
          font-size="20"
          font-weight="700"
          fill="#ffffff"
          font-family="sans-serif"
        >
          {displayHour}:{mins}{period}
        </text>
        <text
          x={cx.toFixed(2)} y={(cy + 8).toFixed(2)}
          text-anchor="middle"
          dominant-baseline="central"
          font-size="9"
          fill="rgba(255,255,255,0.5)"
          font-family="sans-serif"
        >
          {activeNow.length > 0
            ? `${activeNow.length} active now`
            : 'quiet hour'}
        </text>
      </g>
    );
  }

  render() {
    const cx = 200, cy = 200;
    const outerR = 155, innerR = 75, markerR = 170;
    const svgSize = 400;

    return (
      <div class="day-wheel-view">
        <div class="wheel-container">
          <svg
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            class="wheel-svg"
            role="img"
            aria-label="24-hour activity wheel"
          >
            <title>24-hour activity wheel showing when organisms are most active</title>

            {/* Background circle */}
            <circle cx={cx} cy={cy} r={outerR + 20} fill="#0d1f2d" />

            {/* 24 hour segments */}
            {Array.from({ length: 24 }, (_, hr) => (
              <path
                key={`seg-${hr}`}
                d={donutSegment(cx, cy, innerR, outerR, hr, hr + 1)}
                fill={hourColor(hr)}
                stroke="#0d1f2d"
                stroke-width="0.5"
                opacity="0.85"
              />
            ))}

            {/* Subtle segment lines */}
            {Array.from({ length: 24 }, (_, hr) => {
              const angle = hourToAngle(hr);
              const innerPt = polar(cx, cy, innerR, angle);
              const outerPt = polar(cx, cy, outerR, angle);
              return (
                <line
                  key={`line-${hr}`}
                  x1={innerPt.x.toFixed(2)} y1={innerPt.y.toFixed(2)}
                  x2={outerPt.x.toFixed(2)} y2={outerPt.y.toFixed(2)}
                  stroke="#0d1f2d"
                  stroke-width="0.8"
                  opacity="0.4"
                />
              );
            })}

            {/* Inner circle (center display) */}
            <circle cx={cx} cy={cy} r={innerR} fill="#0d1f2d" />

            {/* Hour labels */}
            {this.renderHourLabels(cx, cy, outerR + 32)}

            {/* Entity markers */}
            {this.renderEntityMarkers(cx, cy, markerR)}

            {/* Now hand */}
            {this.renderNowHand(cx, cy, innerR, outerR)}

            {/* Center time info */}
            {this.renderCenterInfo(cx, cy, innerR)}
          </svg>
        </div>

        {/* Entity list / legend */}
        <div class="entity-list">
          <h4 class="entity-list__title">Activity by hour</h4>
          <div class="entity-list__items">
            {this.entities
              .filter(e => e.dayPeakHour !== undefined)
              .sort((a, b) => a.dayPeakHour - b.dayPeakHour)
              .map(entity => {
                const hr = entity.dayPeakHour;
                const isSelected = this.selectedEntity?.id === entity.id;
                return (
                  <button
                    key={entity.id}
                    class={`entity-row ${isSelected ? 'entity-row--selected' : ''}`}
                    onClick={() => this.handleEntityClick(entity)}
                  >
                    <span class="entity-row__hour">{hr}:00</span>
                    <span class="entity-row__name">{entity.commonName}</span>
                    <span class="entity-row__sci">{entity.scientificName}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Detail panel */}
        {this.selectedEntity && (
          <div class="detail-panel">
            <div class="detail-panel__header">
              <h3>{this.selectedEntity.commonName}</h3>
              <span class="detail-panel__sci">{this.selectedEntity.scientificName}</span>
              <button class="detail-panel__close" onClick={() => { this.selectedEntity = null; }}>✕</button>
            </div>
            {this.selectedEntity.status && (
              <p class="detail-panel__status">{this.selectedEntity.status}</p>
            )}
            <p class="detail-panel__time">
              Peak activity: <strong>{this.selectedEntity.dayPeakHour}:00</strong>
              {this.selectedEntity.dayDurationHours && ` · active for ~${this.selectedEntity.dayDurationHours}h`}
            </p>
            {this.selectedEntity.iNatUrl && (
              <a href={this.selectedEntity.iNatUrl} target="_blank" rel="noopener noreferrer" class="detail-panel__link">
                View on iNaturalist →
              </a>
            )}
          </div>
        )}

        <div class="legend">
          <div class="legend__item"><span class="legend__swatch" style={{ background: '#0a1628' }}></span>Night</div>
          <div class="legend__item"><span class="legend__swatch" style={{ background: '#bf5a2e' }}></span>Dawn</div>
          <div class="legend__item"><span class="legend__swatch" style={{ background: '#4fc3f7' }}></span>Day</div>
          <div class="legend__item"><span class="legend__swatch" style={{ background: '#e64a19' }}></span>Dusk</div>
          <div class="legend__item"><span class="legend__swatch" style={{ background: '#4a148c' }}></span>Evening</div>
        </div>
      </div>
    );
  }
}
