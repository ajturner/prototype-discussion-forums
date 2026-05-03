'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-1a18ff50.js');

const hereDayWheelCss = ":host{display:block;width:100%;height:100%}.day-wheel-view{display:flex;flex-direction:column;align-items:center;padding:16px;gap:16px;color:#e0f2fe;min-height:100%}.wheel-container{width:100%;max-width:380px}.wheel-svg{width:100%;height:auto;display:block}.wheel-svg .entity-marker{cursor:pointer}.wheel-svg .entity-marker__dot{transition:r 0.15s ease}.wheel-svg .entity-marker:hover .entity-marker__dot{r:11}.entity-list{width:100%;max-width:380px}.entity-list__title{font-size:12px;font-weight:600;color:#78909c;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px}.entity-list__items{display:flex;flex-direction:column;gap:2px;max-height:200px;overflow-y:auto}.entity-row{display:flex;align-items:center;gap:8px;padding:6px 10px;background:rgba(255, 255, 255, 0.04);border:1px solid transparent;border-radius:6px;cursor:pointer;font-family:inherit;text-align:left;color:#b0bec5;transition:background 0.12s ease;font-size:12px}.entity-row:hover{background:rgba(255, 255, 255, 0.09);color:#e0f2fe}.entity-row--selected{background:rgba(244, 67, 54, 0.15);border-color:rgba(244, 67, 54, 0.4);color:#ef9a9a}.entity-row__hour{font-size:11px;font-family:monospace;color:#546e7a;min-width:36px}.entity-row__name{flex:1;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.entity-row__sci{font-size:10px;font-style:italic;color:#546e7a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px}.detail-panel{width:100%;max-width:380px;background:rgba(255, 255, 255, 0.06);border:1px solid rgba(255, 255, 255, 0.12);border-radius:10px;padding:14px;animation:fadeUp 0.2s ease}.detail-panel__header{display:flex;align-items:baseline;gap:8px;margin-bottom:8px}.detail-panel__header h3{margin:0;font-size:15px;color:#ffffff;flex:1}.detail-panel__sci{font-size:11px;font-style:italic;color:#78909c}.detail-panel__close{background:none;border:none;color:#78909c;cursor:pointer;font-size:14px;padding:2px 4px;border-radius:4px;font-family:inherit}.detail-panel__close:hover{color:#e0f2fe}.detail-panel__status{font-size:12px;color:#a5d6a7;margin:4px 0}.detail-panel__time{font-size:12px;color:#b0bec5;margin:4px 0}.detail-panel__link{display:inline-block;margin-top:8px;font-size:11px;color:#4fc3f7;text-decoration:none}.detail-panel__link:hover{text-decoration:underline}.legend{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;padding:8px 0}.legend__item{display:flex;align-items:center;gap:5px;font-size:11px;color:#78909c}.legend__swatch{width:14px;height:14px;border-radius:3px;flex-shrink:0}@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}";

/** Returns the SVG angle (radians) for a given hour (0-23), with midnight at top */
function hourToAngle(hour, minute = 0) {
  return ((hour + minute / 60) / 24) * 2 * Math.PI - Math.PI / 2;
}
/** Convert polar coordinates to Cartesian */
function polar$1(cx, cy, r, angle) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}
/** Build an SVG donut segment path for a time range (hours, 0-24) */
function donutSegment(cx, cy, innerR, outerR, startHour, endHour) {
  const sa = hourToAngle(startHour);
  const ea = hourToAngle(endHour);
  const large = endHour - startHour > 12 ? 1 : 0;
  const o1 = polar$1(cx, cy, outerR, sa);
  const o2 = polar$1(cx, cy, outerR, ea);
  const i1 = polar$1(cx, cy, innerR, sa);
  const i2 = polar$1(cx, cy, innerR, ea);
  return [
    `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
    `L ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}
/** Color for each hour segment based on light level */
function hourColor(hour) {
  if (hour >= 0 && hour < 4)
    return '#0a1628'; // Deep night
  if (hour >= 4 && hour < 6)
    return '#1a2a4a'; // Pre-dawn
  if (hour >= 6 && hour < 8)
    return '#bf5a2e'; // Dawn
  if (hour >= 8 && hour < 11)
    return '#87ceeb'; // Morning
  if (hour >= 11 && hour < 15)
    return '#4fc3f7'; // Midday
  if (hour >= 15 && hour < 18)
    return '#f9a825'; // Afternoon
  if (hour >= 18 && hour < 20)
    return '#e64a19'; // Dusk
  if (hour >= 20 && hour < 22)
    return '#4a148c'; // Evening
  return '#0a1628'; // Night
}
const HereDayWheel = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.entities = [];
    this.localTime = undefined;
    this.selectedEntity = null;
    this.hoveredHour = null;
  }
  get now() {
    return this.localTime || new Date();
  }
  handleEntityClick(entity) {
    var _a;
    this.selectedEntity = ((_a = this.selectedEntity) === null || _a === void 0 ? void 0 : _a.id) === entity.id ? null : entity;
  }
  renderNowHand(cx, cy, _innerR, outerR) {
    const now = this.now;
    const angle = hourToAngle(now.getHours(), now.getMinutes());
    const outer = polar$1(cx, cy, outerR + 14, angle);
    return (index.h("line", { x1: cx.toFixed(2), y1: cy.toFixed(2), x2: outer.x.toFixed(2), y2: outer.y.toFixed(2), stroke: "#f44336", "stroke-width": "2.5", "stroke-linecap": "round", opacity: "0.9" }));
  }
  renderHourLabels(cx, cy, r) {
    const labels = [0, 3, 6, 9, 12, 15, 18, 21];
    return labels.map(hr => {
      const angle = hourToAngle(hr);
      const pos = polar$1(cx, cy, r, angle);
      return (index.h("text", { key: `lbl-${hr}`, x: pos.x.toFixed(2), y: pos.y.toFixed(2), "text-anchor": "middle", "dominant-baseline": "central", "font-size": "11", fill: "rgba(255,255,255,0.6)", "font-family": "sans-serif" }, hr === 0 ? '12am' : hr === 12 ? '12pm' : hr < 12 ? `${hr}am` : `${hr - 12}pm`));
    });
  }
  renderEntityMarkers(cx, cy, markerR) {
    const placed = new Map(); // hour → count for stagger
    return this.entities
      .filter(e => e.dayPeakHour !== undefined)
      .map(entity => {
      var _a;
      const hour = entity.dayPeakHour;
      const key = String(hour);
      const offset = placed.get(key) || 0;
      placed.set(key, offset + 1);
      // Slightly stagger entities at the same hour
      const angle = hourToAngle(hour, offset * 12);
      const r = markerR + offset * 10;
      const pos = polar$1(cx, cy, r, angle);
      const isSelected = ((_a = this.selectedEntity) === null || _a === void 0 ? void 0 : _a.id) === entity.id;
      return (index.h("g", { key: entity.id, class: "entity-marker", onClick: () => this.handleEntityClick(entity), role: "button", "aria-label": `${entity.commonName}, peak ${hour}:00` }, index.h("circle", { cx: pos.x.toFixed(2), cy: pos.y.toFixed(2), r: isSelected ? '12' : '9', fill: isSelected ? '#f44336' : 'rgba(255,255,255,0.85)', stroke: isSelected ? '#b71c1c' : 'rgba(0,0,0,0.3)', "stroke-width": "1", class: "entity-marker__dot" }), index.h("text", { x: pos.x.toFixed(2), y: pos.y.toFixed(2), "text-anchor": "middle", "dominant-baseline": "central", "font-size": isSelected ? '11' : '9', fill: isSelected ? '#fff' : '#333', style: { pointerEvents: 'none' } }, entity.commonName.charAt(0))));
    });
  }
  renderCenterInfo(cx, cy, _innerR) {
    const now = this.now;
    const hours = now.getHours();
    const mins = now.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'pm' : 'am';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    // Find entities active near now
    const activeNow = this.entities.filter(e => {
      if (e.dayPeakHour === undefined)
        return false;
      const dur = e.dayDurationHours || 3;
      const diff = Math.abs(e.dayPeakHour - hours);
      return diff <= dur / 2 || diff >= (24 - dur / 2);
    });
    return (index.h("g", null, index.h("text", { x: cx.toFixed(2), y: (cy - 16).toFixed(2), "text-anchor": "middle", "dominant-baseline": "central", "font-size": "20", "font-weight": "700", fill: "#ffffff", "font-family": "sans-serif" }, displayHour, ":", mins, period), index.h("text", { x: cx.toFixed(2), y: (cy + 8).toFixed(2), "text-anchor": "middle", "dominant-baseline": "central", "font-size": "9", fill: "rgba(255,255,255,0.5)", "font-family": "sans-serif" }, activeNow.length > 0
      ? `${activeNow.length} active now`
      : 'quiet hour')));
  }
  render() {
    const cx = 200, cy = 200;
    const outerR = 155, innerR = 75, markerR = 170;
    const svgSize = 400;
    return (index.h("div", { class: "day-wheel-view" }, index.h("div", { class: "wheel-container" }, index.h("svg", { viewBox: `0 0 ${svgSize} ${svgSize}`, class: "wheel-svg", role: "img", "aria-label": "24-hour activity wheel" }, index.h("title", null, "24-hour activity wheel showing when organisms are most active"), index.h("circle", { cx: cx, cy: cy, r: outerR + 20, fill: "#0d1f2d" }), Array.from({ length: 24 }, (_, hr) => (index.h("path", { key: `seg-${hr}`, d: donutSegment(cx, cy, innerR, outerR, hr, hr + 1), fill: hourColor(hr), stroke: "#0d1f2d", "stroke-width": "0.5", opacity: "0.85" }))), Array.from({ length: 24 }, (_, hr) => {
      const angle = hourToAngle(hr);
      const innerPt = polar$1(cx, cy, innerR, angle);
      const outerPt = polar$1(cx, cy, outerR, angle);
      return (index.h("line", { key: `line-${hr}`, x1: innerPt.x.toFixed(2), y1: innerPt.y.toFixed(2), x2: outerPt.x.toFixed(2), y2: outerPt.y.toFixed(2), stroke: "#0d1f2d", "stroke-width": "0.8", opacity: "0.4" }));
    }), index.h("circle", { cx: cx, cy: cy, r: innerR, fill: "#0d1f2d" }), this.renderHourLabels(cx, cy, outerR + 32), this.renderEntityMarkers(cx, cy, markerR), this.renderNowHand(cx, cy, innerR, outerR), this.renderCenterInfo(cx, cy, innerR))), index.h("div", { class: "entity-list" }, index.h("h4", { class: "entity-list__title" }, "Activity by hour"), index.h("div", { class: "entity-list__items" }, this.entities
      .filter(e => e.dayPeakHour !== undefined)
      .sort((a, b) => a.dayPeakHour - b.dayPeakHour)
      .map(entity => {
      var _a;
      const hr = entity.dayPeakHour;
      const isSelected = ((_a = this.selectedEntity) === null || _a === void 0 ? void 0 : _a.id) === entity.id;
      return (index.h("button", { key: entity.id, class: `entity-row ${isSelected ? 'entity-row--selected' : ''}`, onClick: () => this.handleEntityClick(entity) }, index.h("span", { class: "entity-row__hour" }, hr, ":00"), index.h("span", { class: "entity-row__name" }, entity.commonName), index.h("span", { class: "entity-row__sci" }, entity.scientificName)));
    }))), this.selectedEntity && (index.h("div", { class: "detail-panel" }, index.h("div", { class: "detail-panel__header" }, index.h("h3", null, this.selectedEntity.commonName), index.h("span", { class: "detail-panel__sci" }, this.selectedEntity.scientificName), index.h("button", { class: "detail-panel__close", onClick: () => { this.selectedEntity = null; } }, "\u2715")), this.selectedEntity.status && (index.h("p", { class: "detail-panel__status" }, this.selectedEntity.status)), index.h("p", { class: "detail-panel__time" }, "Peak activity: ", index.h("strong", null, this.selectedEntity.dayPeakHour, ":00"), this.selectedEntity.dayDurationHours && ` · active for ~${this.selectedEntity.dayDurationHours}h`), this.selectedEntity.iNatUrl && (index.h("a", { href: this.selectedEntity.iNatUrl, target: "_blank", rel: "noopener noreferrer", class: "detail-panel__link" }, "View on iNaturalist \u2192")))), index.h("div", { class: "legend" }, index.h("div", { class: "legend__item" }, index.h("span", { class: "legend__swatch", style: { background: '#0a1628' } }), "Night"), index.h("div", { class: "legend__item" }, index.h("span", { class: "legend__swatch", style: { background: '#bf5a2e' } }), "Dawn"), index.h("div", { class: "legend__item" }, index.h("span", { class: "legend__swatch", style: { background: '#4fc3f7' } }), "Day"), index.h("div", { class: "legend__item" }, index.h("span", { class: "legend__swatch", style: { background: '#e64a19' } }), "Dusk"), index.h("div", { class: "legend__item" }, index.h("span", { class: "legend__swatch", style: { background: '#4a148c' } }), "Evening"))));
  }
};
HereDayWheel.style = hereDayWheelCss;

const hereDeepTimeCss = ":host{display:block;width:100%;height:100%}.empty{padding:24px;text-align:center;color:#9e9e9e}.deep-time-view{display:flex;flex-direction:column;height:100%;color:#e0f2fe}.deep-time-layout{display:flex;flex:1;gap:0;overflow:hidden}.scrubber-panel{display:flex;flex-direction:column;align-items:center;width:68px;flex-shrink:0;background:#0d1f2d;border-right:1px solid #1e3a52;padding:8px 6px;gap:6px;overflow-y:auto}.scrubber-label{font-size:9px;color:#78909c;text-align:center;text-transform:uppercase;letter-spacing:0.04em;font-family:monospace;line-height:1.2}.scrubber-label--top{color:#4fc3f7}.scrubber-label--bottom{color:#9c27b0}.scrubber{appearance:slider-vertical;writing-mode:vertical-lr;direction:rtl;width:8px;height:160px;cursor:pointer;accent-color:#4fc3f7;flex-shrink:0}.scrubber::-webkit-slider-thumb{appearance:none;width:18px;height:18px;border-radius:50%;background:#4fc3f7;border:2px solid #0d1f2d;cursor:pointer}.timeline{display:flex;flex-direction:column;gap:0;width:100%}.timeline__node{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 2px;background:none;border:none;cursor:pointer;font-family:inherit;border-left:2px solid transparent;transition:border-color 0.15s ease}.timeline__node:hover{background:rgba(255, 255, 255, 0.05)}.timeline__node--active{border-left-color:var(--era-color, #4fc3f7);background:rgba(255, 255, 255, 0.06)}.timeline__node--active .timeline__dot{background:var(--era-color, #4fc3f7);transform:scale(1.3)}.timeline__dot{width:8px;height:8px;border-radius:50%;background:#37474f;transition:background 0.15s ease, transform 0.15s ease;flex-shrink:0}.timeline__label{font-size:8px;color:#546e7a;text-align:center;line-height:1.2;font-family:monospace}.timeline__node--active .timeline__label{color:var(--era-color, #4fc3f7);font-weight:700}.content-panel{flex:1;overflow-y:auto;padding:16px}.era-content{display:flex;flex-direction:column;gap:14px;animation:slideIn 0.25s ease}.era-content__header{display:flex;flex-direction:column;gap:4px}.era-content__badge{display:inline-block;padding:3px 10px;border-radius:12px;background:var(--era-color, #4fc3f7);color:#000000;font-size:11px;font-weight:700;letter-spacing:0.04em;align-self:flex-start}.era-content__environment{margin:0;font-size:16px;font-weight:700;color:#ffffff;line-height:1.3}.era-content__illustration{width:100%;border-radius:10px;overflow:hidden}.era-content__illustration-placeholder{width:100%;height:100px;display:flex;align-items:center;justify-content:center;font-size:52px;opacity:0.7;border-radius:10px}.era-content__narrative{font-size:13px;line-height:1.7;color:#b0bec5;margin:0}.era-content__fossils{background:rgba(255, 255, 255, 0.04);border:1px solid rgba(255, 255, 255, 0.08);border-radius:8px;padding:10px 12px}.era-content__fossils-title{font-size:11px;font-weight:700;color:#78909c;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px}.era-content__sources{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.era-content__source-label{font-size:10px;color:#546e7a}.era-content__source-link{font-size:10px;color:#4fc3f7;text-decoration:none}.era-content__source-link:hover{text-decoration:underline}.fossil-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.fossil-list__item{display:flex;flex-direction:column;gap:1px}.fossil-list__name{font-size:12px;font-weight:600;color:#cfd8dc}.fossil-list__taxon{font-size:10px;font-style:italic;color:#607d8b}.fossil-list__age{font-size:10px;color:#546e7a;font-family:monospace}.era-nav{display:flex;align-items:center;justify-content:center;gap:16px;padding:10px;background:#0d1f2d;border-top:1px solid #1e3a52}.era-nav__btn{background:none;border:1px solid #1e3a52;color:#78909c;font-size:12px;padding:6px 14px;border-radius:6px;cursor:pointer;font-family:inherit;transition:color 0.12s ease, border-color 0.12s ease}.era-nav__btn:hover:not(:disabled){color:#4fc3f7;border-color:#4fc3f7}.era-nav__btn:disabled{opacity:0.3;cursor:not-allowed}.era-nav__divider{color:#1e3a52;font-size:14px}@keyframes slideIn{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}";

const HereDeepTime = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.eras = [];
    this.activeIndex = 0;
  }
  get activeEra() {
    return this.eras[this.activeIndex] || null;
  }
  handleScrub(e) {
    const input = e.target;
    this.activeIndex = Number(input.value);
  }
  renderTimeline() {
    return (index.h("div", { class: "timeline" }, this.eras.map((era, i) => (index.h("button", { key: era.yearsAgoDisplay, class: `timeline__node ${i === this.activeIndex ? 'timeline__node--active' : ''}`, style: { '--era-color': era.color }, onClick: () => { this.activeIndex = i; }, "aria-label": `Jump to ${era.yearsAgoDisplay}`, "aria-pressed": String(i === this.activeIndex) }, index.h("span", { class: "timeline__dot" }), index.h("span", { class: "timeline__label" }, era.yearsAgoDisplay))))));
  }
  renderEraContent(era) {
    return (index.h("div", { class: "era-content", key: era.yearsAgoDisplay, style: { '--era-color': era.color } }, index.h("div", { class: "era-content__header" }, index.h("div", { class: "era-content__badge" }, era.yearsAgoDisplay), index.h("h2", { class: "era-content__environment" }, era.environment)), index.h("div", { class: "era-content__illustration", "aria-hidden": "true" }, index.h("div", { class: "era-content__illustration-placeholder", style: { background: era.color } }, this.getEraEmoji(era))), index.h("p", { class: "era-content__narrative" }, era.narrative), era.fossils && era.fossils.length > 0 && (index.h("div", { class: "era-content__fossils" }, index.h("h4", { class: "era-content__fossils-title" }, "Fossil Record"), index.h("ul", { class: "fossil-list" }, era.fossils.map(f => (index.h("li", { key: f.name, class: "fossil-list__item" }, index.h("span", { class: "fossil-list__name" }, f.name), index.h("span", { class: "fossil-list__taxon" }, f.taxon), index.h("span", { class: "fossil-list__age" }, f.ageDisplay))))))), index.h("div", { class: "era-content__sources" }, index.h("span", { class: "era-content__source-label" }, "Data sources:"), index.h("a", { class: "era-content__source-link", href: `https://macrostrat.org/map#x=${-122.06}&y=${37.56}&z=10`, target: "_blank", rel: "noopener noreferrer" }, "Macrostrat"), era.fossils.length > 0 && (index.h("a", { class: "era-content__source-link", href: `https://paleobiodb.org/classic/displayCollResults?lngmin=-122.5&lngmax=-121.5&latmin=37.0&latmax=38.0`, target: "_blank", rel: "noopener noreferrer" }, "PBDB")))));
  }
  getEraEmoji(era) {
    if (era.yearsAgo === 0)
      return '🌿';
    if (era.yearsAgo <= 15000)
      return '🦌';
    if (era.yearsAgo <= 150000)
      return '🦣';
    if (era.yearsAgo <= 1500000)
      return '🐺';
    if (era.yearsAgo <= 15000000)
      return '🦏';
    if (era.yearsAgo <= 150000000)
      return '🦕';
    return '🐚';
  }
  render() {
    if (!this.eras || this.eras.length === 0) {
      return index.h("div", { class: "empty" }, "No deep time data available.");
    }
    const era = this.activeEra;
    return (index.h("div", { class: "deep-time-view" }, index.h("div", { class: "deep-time-layout" }, index.h("div", { class: "scrubber-panel" }, index.h("div", { class: "scrubber-label scrubber-label--top" }, "TODAY"), index.h("input", { type: "range", class: "scrubber", min: "0", max: String(this.eras.length - 1), step: "1", value: String(this.activeIndex), "aria-label": "Time scrubber", onInput: this.handleScrub.bind(this) }), index.h("div", { class: "scrubber-label scrubber-label--bottom" }, "500 Mya"), this.renderTimeline()), index.h("div", { class: "content-panel" }, era && this.renderEraContent(era))), index.h("div", { class: "era-nav" }, index.h("button", { class: "era-nav__btn", disabled: this.activeIndex === 0, onClick: () => {
        if (this.activeIndex > 0)
          this.activeIndex--;
      }, "aria-label": "Go to more recent era" }, "\u2191 More recent"), index.h("span", { class: "era-nav__divider" }, "|"), index.h("button", { class: "era-nav__btn", disabled: this.activeIndex === this.eras.length - 1, onClick: () => {
        if (this.activeIndex < this.eras.length - 1)
          this.activeIndex++;
      }, "aria-label": "Go to older era" }, "Older \u2193"))));
  }
};
HereDeepTime.style = hereDeepTimeCss;

const hereModeSwitcherCss = ":host{display:block;width:100%}.mode-switcher{display:flex;width:100%;background:#0d1f2d;border-bottom:1px solid #1e3a52}.mode-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:10px 4px;background:none;border:none;border-bottom:3px solid transparent;color:#78909c;cursor:pointer;transition:color 0.15s ease, border-color 0.15s ease, background 0.15s ease;font-family:inherit;font-size:12px;line-height:1}.mode-btn:hover{color:#b0bec5;background:rgba(255, 255, 255, 0.05)}.mode-btn:focus-visible{outline:2px solid #42a5f5;outline-offset:-2px}.mode-btn--active{color:#4fc3f7;border-bottom-color:#4fc3f7}.mode-btn__icon{font-size:18px;line-height:1}.mode-btn__label{font-size:11px;font-weight:500;letter-spacing:0.02em;text-transform:uppercase}";

const MODES = [
  { key: 'strata', icon: '≡', label: 'Strata', ariaLabel: 'View by vertical strata layers' },
  { key: 'day', icon: '☉', label: 'Day', ariaLabel: 'View time-of-day activity' },
  { key: 'phenology', icon: '⟳', label: 'Season', ariaLabel: 'View seasonal phenology calendar' },
  { key: 'deep-time', icon: '⏳', label: 'Deep Time', ariaLabel: 'Explore geological deep time' },
];
const HereModeSwitcher = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.modeChange = index.createEvent(this, "modeChange", 7);
    this.activeMode = 'strata';
  }
  handleModeClick(mode) {
    if (mode !== this.activeMode) {
      this.modeChange.emit(mode);
    }
  }
  render() {
    return (index.h("nav", { class: "mode-switcher", role: "tablist", "aria-label": "Exploration modes" }, MODES.map(m => (index.h("button", { key: m.key, role: "tab", class: `mode-btn ${this.activeMode === m.key ? 'mode-btn--active' : ''}`, "aria-selected": String(this.activeMode === m.key), "aria-label": m.ariaLabel, onClick: () => this.handleModeClick(m.key) }, index.h("span", { class: "mode-btn__icon", "aria-hidden": "true" }, m.icon), index.h("span", { class: "mode-btn__label" }, m.label))))));
  }
};
HereModeSwitcher.style = hereModeSwitcherCss;

const herePhenologyWheelCss = ":host{display:block;width:100%}.phenology-view{display:flex;flex-direction:column;align-items:center;padding:12px 16px;gap:12px;color:#e0f2fe}.filters{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;width:100%}.filter-pill{padding:4px 12px;border-radius:14px;border:1.5px solid var(--cat-color, #888);background:transparent;color:var(--cat-color, #888);font-size:11px;font-weight:600;text-transform:capitalize;cursor:pointer;font-family:inherit;transition:background 0.15s ease, color 0.15s ease}.filter-pill:hover{background:rgba(255, 255, 255, 0.08)}.filter-pill--active{background:var(--cat-color, #888);color:#000000}.wheel-container{width:100%;max-width:440px}.wheel-svg{width:100%;height:auto;display:block}.wheel-svg .entity-arc{cursor:pointer;transition:opacity 0.15s ease}.wheel-svg .entity-arc:hover{opacity:0.9 !important}.legend{display:flex;flex-wrap:wrap;gap:8px 16px;justify-content:center}.legend__item{display:flex;align-items:center;gap:5px;font-size:11px;color:#78909c;text-transform:capitalize}.legend__swatch{width:12px;height:12px;border-radius:2px;flex-shrink:0}.detail-panel{width:100%;max-width:440px;background:rgba(255, 255, 255, 0.06);border:1px solid rgba(255, 255, 255, 0.12);border-radius:10px;padding:12px 14px;animation:fadeUp 0.2s ease}.detail-panel__header{display:flex;align-items:center;gap:8px;margin-bottom:6px}.detail-panel__header h3{margin:0;font-size:14px;font-weight:700;color:#ffffff;flex:1}.detail-panel__cat-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}.detail-panel__sci{font-size:11px;font-style:italic;color:#78909c}.detail-panel__close{background:none;border:none;color:#78909c;cursor:pointer;font-size:14px;padding:2px 4px;border-radius:4px;font-family:inherit;flex-shrink:0}.detail-panel__close:hover{color:#e0f2fe}.detail-panel__meta{font-size:12px;color:#b0bec5;margin:3px 0}.detail-panel__link{display:inline-block;margin-top:6px;font-size:11px;color:#4fc3f7;text-decoration:none}.detail-panel__link:hover{text-decoration:underline}.active-now{width:100%;max-width:440px}.active-now__title{font-size:12px;font-weight:600;color:#78909c;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px}.active-now__list{display:flex;flex-wrap:wrap;gap:6px}.active-chip{padding:4px 10px;border-radius:12px;border:1px solid var(--cat-color, rgba(255, 255, 255, 0.2));background:rgba(255, 255, 255, 0.05);color:var(--cat-color, #b0bec5);font-size:12px;cursor:pointer;font-family:inherit;transition:background 0.12s ease}.active-chip:hover{background:rgba(255, 255, 255, 0.1)}.active-chip--selected{background:var(--cat-color, rgba(255, 255, 255, 0.2));color:#000000}@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}";

const CATEGORY_COLORS = {
  bloom: '#ffd600',
  migration: '#2196f3',
  breed: '#f44336',
  fruit: '#ff9800',
  hibernate: '#9e9e9e',
  emerge: '#4caf50',
};
const CATEGORY_RADII = {
  // [innerR, outerR] for each band
  bloom: [120, 142],
  migration: [146, 168],
  breed: [172, 194],
  fruit: [92, 114],
  hibernate: [64, 86],
  emerge: [38, 60],
};
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function weekToAngle(week) {
  // Week 1 starts at top (-PI/2); increases clockwise
  return ((week - 1) / 52) * 2 * Math.PI - Math.PI / 2;
}
function polar(cx, cy, r, angle) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}
function donutArc(cx, cy, innerR, outerR, startWeek, endWeek, wrapAround = false) {
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
const HerePhenologyWheel = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.entities = [];
    this.currentWeek = 1;
    this.selectedEntity = null;
    this.activeFilters = new Set();
  }
  toggleFilter(cat) {
    const next = new Set(this.activeFilters);
    if (next.has(cat)) {
      next.delete(cat);
    }
    else {
      next.add(cat);
    }
    this.activeFilters = next;
  }
  isVisible(entity) {
    if (this.activeFilters.size === 0)
      return true;
    return this.activeFilters.has(entity.phenologyCategory);
  }
  renderMonthLabels(cx, cy, r) {
    return MONTH_LABELS.map((label, i) => {
      // Month i starts at week (i * 52/12) + 1
      const midWeek = (i * 52) / 12 + 52 / 24 + 1;
      const angle = weekToAngle(midWeek);
      const pos = polar(cx, cy, r, angle);
      return (index.h("text", { key: `month-${i}`, x: pos.x.toFixed(2), y: pos.y.toFixed(2), "text-anchor": "middle", "dominant-baseline": "central", "font-size": "9", fill: "rgba(255,255,255,0.55)", "font-family": "sans-serif" }, label));
    });
  }
  renderCurrentWeekSlice(cx, cy, innerR, outerR) {
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
    return index.h("path", { d: path, fill: "rgba(255,255,255,0.18)", stroke: "white", "stroke-width": "1.5" });
  }
  renderEntityArcs(cx, cy) {
    return this.entities
      .filter(e => e.phenologyCategory && e.phenologyStartWeek && e.phenologyEndWeek && this.isVisible(e))
      .map(entity => {
      var _a;
      const [innerR, outerR] = CATEGORY_RADII[entity.phenologyCategory];
      const color = CATEGORY_COLORS[entity.phenologyCategory];
      const wraps = entity.phenologyEndWeek < entity.phenologyStartWeek;
      const d = donutArc(cx, cy, innerR, outerR, entity.phenologyStartWeek, entity.phenologyEndWeek, wraps);
      const isSelected = ((_a = this.selectedEntity) === null || _a === void 0 ? void 0 : _a.id) === entity.id;
      return (index.h("path", { key: entity.id, d: d, fill: color, opacity: isSelected ? 1 : 0.65, stroke: isSelected ? 'white' : 'transparent', "stroke-width": isSelected ? '2' : '0', class: "entity-arc", onClick: () => { var _a; this.selectedEntity = ((_a = this.selectedEntity) === null || _a === void 0 ? void 0 : _a.id) === entity.id ? null : entity; }, "aria-label": entity.commonName, role: "button" }));
    });
  }
  renderCenterSummary(cx, cy, _innerR) {
    const active = this.entities.filter(e => {
      if (!e.phenologyStartWeek || !e.phenologyEndWeek || !this.isVisible(e))
        return false;
      const wraps = e.phenologyEndWeek < e.phenologyStartWeek;
      if (wraps) {
        return this.currentWeek >= e.phenologyStartWeek || this.currentWeek <= e.phenologyEndWeek;
      }
      return this.currentWeek >= e.phenologyStartWeek && this.currentWeek <= e.phenologyEndWeek;
    });
    return (index.h("g", null, index.h("text", { x: cx.toFixed(2), y: (cy - 18).toFixed(2), "text-anchor": "middle", "font-size": "22", "font-weight": "700", fill: "#ffffff", "font-family": "sans-serif" }, "Wk ", this.currentWeek), index.h("text", { x: cx.toFixed(2), y: (cy + 4).toFixed(2), "text-anchor": "middle", "font-size": "10", fill: "rgba(255,255,255,0.6)", "font-family": "sans-serif" }, active.length, " active"), index.h("text", { x: cx.toFixed(2), y: (cy + 18).toFixed(2), "text-anchor": "middle", "font-size": "9", fill: "rgba(255,255,255,0.35)", "font-family": "sans-serif" }, "this week")));
  }
  render() {
    const cx = 250, cy = 250;
    const svgSize = 500;
    const outerMost = 210;
    const innerMost = 30;
    const labelR = 228;
    return (index.h("div", { class: "phenology-view" }, index.h("div", { class: "filters" }, Object.keys(CATEGORY_COLORS).map(cat => (index.h("button", { key: cat, class: `filter-pill ${this.activeFilters.has(cat) ? 'filter-pill--active' : ''}`, style: { '--cat-color': CATEGORY_COLORS[cat] }, onClick: () => this.toggleFilter(cat), "aria-pressed": String(this.activeFilters.has(cat)) }, cat)))), index.h("div", { class: "wheel-container" }, index.h("svg", { viewBox: `0 0 ${svgSize} ${svgSize}`, class: "wheel-svg", role: "img", "aria-label": "Phenology wheel showing seasonal activity across the year" }, index.h("title", null, "Annual phenology wheel: each arc shows when organisms bloom, migrate, breed, fruit, hibernate, or emerge"), index.h("circle", { cx: cx, cy: cy, r: outerMost + 8, fill: "#0d1f2d" }), Object.entries(CATEGORY_RADII).map(([cat, [ir, or_]]) => (index.h("circle", { key: `bg-${cat}`, cx: cx, cy: cy, r: (ir + or_) / 2, fill: "none", stroke: CATEGORY_COLORS[cat], "stroke-width": (or_ - ir).toString(), opacity: "0.07" }))), this.renderEntityArcs(cx, cy), this.renderCurrentWeekSlice(cx, cy, innerMost, outerMost), this.renderMonthLabels(cx, cy, labelR), index.h("circle", { cx: cx, cy: cy, r: innerMost - 2, fill: "#0d1f2d" }), this.renderCenterSummary(cx, cy, innerMost))), index.h("div", { class: "legend" }, Object.entries(CATEGORY_COLORS).map(([cat, color]) => (index.h("div", { key: cat, class: "legend__item" }, index.h("span", { class: "legend__swatch", style: { background: color } }), index.h("span", { class: "legend__label" }, cat))))), this.selectedEntity && (index.h("div", { class: "detail-panel" }, index.h("div", { class: "detail-panel__header" }, index.h("div", { class: "detail-panel__cat-dot", style: { background: CATEGORY_COLORS[this.selectedEntity.phenologyCategory] } }), index.h("h3", null, this.selectedEntity.commonName), index.h("span", { class: "detail-panel__sci" }, this.selectedEntity.scientificName), index.h("button", { class: "detail-panel__close", onClick: () => { this.selectedEntity = null; } }, "\u2715")), index.h("p", { class: "detail-panel__meta" }, "Category: ", index.h("strong", null, this.selectedEntity.phenologyCategory), this.selectedEntity.phenologyPeakWeek && ` · Peak: week ${this.selectedEntity.phenologyPeakWeek}`), this.selectedEntity.phenologyStartWeek && this.selectedEntity.phenologyEndWeek && (index.h("p", { class: "detail-panel__meta" }, "Season: weeks ", this.selectedEntity.phenologyStartWeek, "\u2013", this.selectedEntity.phenologyEndWeek)), this.selectedEntity.iNatUrl && (index.h("a", { href: this.selectedEntity.iNatUrl, target: "_blank", rel: "noopener noreferrer", class: "detail-panel__link" }, "View on iNaturalist \u2192")))), index.h("div", { class: "active-now" }, index.h("h4", { class: "active-now__title" }, "Active this week (week ", this.currentWeek, ")"), index.h("div", { class: "active-now__list" }, this.entities
      .filter(e => {
      if (!e.phenologyStartWeek || !e.phenologyEndWeek || !this.isVisible(e))
        return false;
      const wraps = e.phenologyEndWeek < e.phenologyStartWeek;
      if (wraps) {
        return this.currentWeek >= e.phenologyStartWeek || this.currentWeek <= e.phenologyEndWeek;
      }
      return this.currentWeek >= e.phenologyStartWeek && this.currentWeek <= e.phenologyEndWeek;
    })
      .map(e => {
      var _a;
      return (index.h("button", { key: e.id, class: `active-chip ${((_a = this.selectedEntity) === null || _a === void 0 ? void 0 : _a.id) === e.id ? 'active-chip--selected' : ''}`, style: { '--cat-color': CATEGORY_COLORS[e.phenologyCategory] }, onClick: () => { var _a; this.selectedEntity = ((_a = this.selectedEntity) === null || _a === void 0 ? void 0 : _a.id) === e.id ? null : e; } }, e.commonName));
    })))));
  }
};
HerePhenologyWheel.style = herePhenologyWheelCss;

const hereStrataCss = ":host{display:block;width:100%;height:100%}.empty{padding:24px;color:#9e9e9e;text-align:center}.strata-view{display:flex;flex-direction:column;height:100%}.strata-layout{display:flex;flex:1;overflow:hidden}.ruler{display:flex;flex-direction:column;width:60px;flex-shrink:0;background:#1a2a3a;padding:0 4px;overflow:hidden}.ruler__mark{display:flex;align-items:center;justify-content:flex-end;border-bottom:1px solid rgba(255, 255, 255, 0.1);padding-right:6px;min-height:40px}.ruler__label{font-size:9px;color:#78909c;text-align:right;line-height:1.2;font-family:monospace}.strata-column{flex:1;overflow-y:auto;overflow-x:hidden}.layer{width:100%;transition:flex 0.3s ease}.layer__header{width:100%;display:flex;align-items:center;gap:8px;padding:12px 14px;border:none;cursor:pointer;font-family:inherit;text-align:left;transition:filter 0.15s ease;background:inherit;color:inherit}.layer__header:hover{filter:brightness(1.08)}.layer__header:focus-visible{outline:2px solid rgba(255, 255, 255, 0.6);outline-offset:-2px}.layer__label{font-size:13px;font-weight:600;flex-shrink:0;min-width:140px}.layer__entities-preview{display:flex;flex-wrap:wrap;gap:4px;flex:1;overflow:hidden;max-height:24px}.layer__entity-chip{font-size:11px;padding:1px 7px;border-radius:10px;background:rgba(255, 255, 255, 0.2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px}.layer__entity-more{font-size:11px;padding:1px 7px;border-radius:10px;background:rgba(255, 255, 255, 0.1);white-space:nowrap}.layer__toggle{font-size:11px;flex-shrink:0;margin-left:auto;opacity:0.7}.layer__body{padding:12px 14px 16px;background:rgba(0, 0, 0, 0.15);animation:slideDown 0.2s ease}.layer__description{font-size:12px;line-height:1.5;opacity:0.85;margin:0 0 12px}.layer__entity-list{display:flex;flex-direction:column;gap:4px}.layer--expanded .layer__header{border-bottom:1px solid rgba(255, 255, 255, 0.15)}.entity-btn{display:flex;flex-direction:column;padding:8px 10px;background:rgba(255, 255, 255, 0.12);border:1px solid rgba(255, 255, 255, 0.15);border-radius:6px;cursor:pointer;font-family:inherit;text-align:left;transition:background 0.15s ease;color:inherit}.entity-btn:hover{background:rgba(255, 255, 255, 0.2)}.entity-btn--selected{background:rgba(255, 255, 255, 0.25);border-color:rgba(255, 255, 255, 0.5)}.entity-btn__name{font-size:13px;font-weight:500}.entity-btn__sci{font-size:11px;font-style:italic;opacity:0.7;margin-top:1px}.entity-panel{margin-top:12px;padding:12px;background:rgba(0, 0, 0, 0.25);border-radius:8px;border:1px solid rgba(255, 255, 255, 0.15);animation:fadeIn 0.2s ease}.entity-panel__header{display:flex;align-items:baseline;gap:8px;margin-bottom:8px}.entity-panel__name{font-size:14px;font-weight:700;margin:0;flex:1}.entity-panel__sci{font-size:11px;font-style:italic;opacity:0.7}.entity-panel__close{background:none;border:none;color:inherit;cursor:pointer;font-size:14px;opacity:0.6;padding:2px 4px;border-radius:4px;font-family:inherit;flex-shrink:0}.entity-panel__close:hover{opacity:1}.entity-panel__status{font-size:12px;color:#a5d6a7;margin:4px 0}.entity-panel__meta{font-size:11px;opacity:0.8;margin:4px 0}.entity-panel__link{display:inline-block;margin-top:8px;font-size:11px;color:#90caf9;text-decoration:none}.entity-panel__link:hover{text-decoration:underline}.strata-legend{padding:12px 16px;background:#0d1f2d;border-top:1px solid #1e3a52}.strata-legend__title{font-size:12px;font-weight:600;color:#78909c;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.05em}.strata-legend__desc{font-size:11px;color:#546e7a;margin:0;line-height:1.4}@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}";

const HereStrata = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.layers = [];
    this.expandedLayer = null;
    this.selectedEntity = null;
  }
  toggleLayer(key) {
    this.expandedLayer = this.expandedLayer === key ? null : key;
    this.selectedEntity = null;
  }
  selectEntity(entity) {
    var _a;
    this.selectedEntity = ((_a = this.selectedEntity) === null || _a === void 0 ? void 0 : _a.id) === entity.id ? null : entity;
  }
  renderDepthRuler(layers) {
    return (index.h("div", { class: "ruler", "aria-hidden": "true" }, layers.map((layer, i) => (index.h("div", { key: layer.key, class: "ruler__mark", style: { flex: String(i < 4 ? 1 : 1.2) } }, index.h("span", { class: "ruler__label" }, layer.depthLabel))))));
  }
  renderEntityPanel(entity) {
    return (index.h("div", { class: "entity-panel", role: "region", "aria-label": entity.commonName }, index.h("div", { class: "entity-panel__header" }, index.h("h3", { class: "entity-panel__name" }, entity.commonName), index.h("span", { class: "entity-panel__sci" }, entity.scientificName), index.h("button", { class: "entity-panel__close", onClick: () => { this.selectedEntity = null; }, "aria-label": "Close entity details" }, "\u2715")), entity.status && (index.h("p", { class: "entity-panel__status" }, entity.status)), entity.dayPeakHour !== undefined && (index.h("p", { class: "entity-panel__meta" }, "\u23F0 Peak activity: ", entity.dayPeakHour, ":00", entity.dayDurationHours ? ` (±${Math.round(entity.dayDurationHours / 2)}h)` : '')), entity.phenologyCategory && (index.h("p", { class: "entity-panel__meta" }, "\uD83D\uDDD3\uFE0F Phenology: ", entity.phenologyCategory, entity.phenologyPeakWeek ? ` · peak week ${entity.phenologyPeakWeek}` : '')), entity.iNatUrl && (index.h("a", { class: "entity-panel__link", href: entity.iNatUrl, target: "_blank", rel: "noopener noreferrer" }, "View on iNaturalist \u2192"))));
  }
  render() {
    if (!this.layers || this.layers.length === 0) {
      return index.h("div", { class: "empty" }, "No strata data available.");
    }
    return (index.h("div", { class: "strata-view" }, index.h("div", { class: "strata-layout" }, this.renderDepthRuler(this.layers), index.h("div", { class: "strata-column", role: "list" }, this.layers.map(layer => {
      const isExpanded = this.expandedLayer === layer.key;
      return (index.h("div", { key: layer.key, class: `layer ${isExpanded ? 'layer--expanded' : ''}`, style: { background: layer.color, color: layer.textColor }, role: "listitem" }, index.h("button", { class: "layer__header", style: { background: layer.color, color: layer.textColor }, onClick: () => this.toggleLayer(layer.key), "aria-expanded": String(isExpanded), "aria-controls": `layer-body-${layer.key}` }, index.h("span", { class: "layer__label" }, layer.label), index.h("div", { class: "layer__entities-preview" }, layer.entities.slice(0, 5).map(e => (index.h("span", { key: e.id, class: "layer__entity-chip" }, e.commonName))), layer.entities.length > 5 && (index.h("span", { class: "layer__entity-more" }, "+", layer.entities.length - 5))), index.h("span", { class: "layer__toggle", "aria-hidden": "true" }, isExpanded ? '▲' : '▼')), isExpanded && (index.h("div", { class: "layer__body", id: `layer-body-${layer.key}` }, index.h("p", { class: "layer__description" }, layer.description), index.h("div", { class: "layer__entity-list" }, layer.entities.map(entity => {
        var _a;
        return (index.h("button", { key: entity.id, class: `entity-btn ${((_a = this.selectedEntity) === null || _a === void 0 ? void 0 : _a.id) === entity.id ? 'entity-btn--selected' : ''}`, onClick: () => this.selectEntity(entity) }, index.h("span", { class: "entity-btn__name" }, entity.commonName), index.h("span", { class: "entity-btn__sci" }, entity.scientificName)));
      })), this.selectedEntity && layer.entities.find(e => e.id === this.selectedEntity.id) && (this.renderEntityPanel(this.selectedEntity))))));
    }))), index.h("div", { class: "strata-legend" }, index.h("h4", { class: "strata-legend__title" }, "Ecological Strata"), index.h("p", { class: "strata-legend__desc" }, "Tap any layer to reveal the organisms living in that zone \u2014 from clouds to bedrock."))));
  }
};
HereStrata.style = hereStrataCss;

// ---------------------------------------------------------------------------
// Location
// ---------------------------------------------------------------------------
function getWeekOfYear(d) {
  const start = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((d.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
}
const MOCK_LOCATION = {
  location: {
    lat: 37.5634,
    lng: -122.0617,
    name: 'Coyote Hills Regional Park',
    placeName: 'Fremont, CA',
  },
  weather: {
    tempC: 16,
    description: 'Partly cloudy',
    icon: '⛅',
  },
  localTime: new Date(),
  weekOfYear: getWeekOfYear(new Date()),
};
// ---------------------------------------------------------------------------
// Strata layers
// ---------------------------------------------------------------------------
const MOCK_STRATA_LAYERS = [
  {
    key: 'atmosphere',
    label: 'Climate & Atmosphere',
    depthLabel: 'Sky',
    depthM: 100,
    color: '#cce8f4',
    textColor: '#1a3a5c',
    description: 'Wind, weather, and migratory corridors above the canopy.',
    entities: [
      {
        id: 'turkey-vulture',
        commonName: 'Turkey Vulture',
        scientificName: 'Cathartes aura',
        taxonId: '4756',
        iNatUrl: 'https://www.inaturalist.org/taxa/4756',
        status: 'Soaring overhead daily',
        strataLayer: 'atmosphere',
        dayPeakHour: 11,
        dayDurationHours: 8,
      },
      {
        id: 'american-kestrel',
        commonName: 'American Kestrel',
        scientificName: 'Falco sparverius',
        taxonId: '4740',
        iNatUrl: 'https://www.inaturalist.org/taxa/4740',
        status: 'Resident year-round',
        strataLayer: 'atmosphere',
        dayPeakHour: 9,
        dayDurationHours: 8,
      },
      {
        id: 'peregrine-falcon',
        commonName: 'Peregrine Falcon',
        scientificName: 'Falco peregrinus',
        taxonId: '4762',
        iNatUrl: 'https://www.inaturalist.org/taxa/4762',
        status: 'Occasional visitor',
        strataLayer: 'atmosphere',
        dayPeakHour: 8,
        dayDurationHours: 6,
      },
    ],
  },
  {
    key: 'canopy',
    label: 'Canopy',
    depthLabel: '8 – 20 m',
    depthM: 12,
    color: '#2e7d32',
    textColor: '#e8f5e9',
    description: 'Oak and bay laurel canopy hosting cavity nesters and raptors.',
    entities: [
      {
        id: 'coast-live-oak',
        commonName: 'Coast Live Oak',
        scientificName: 'Quercus agrifolia',
        taxonId: '47820',
        iNatUrl: 'https://www.inaturalist.org/taxa/47820',
        status: 'Dominant tree species',
        strataLayer: 'canopy',
      },
      {
        id: 'acorn-woodpecker',
        commonName: 'Acorn Woodpecker',
        scientificName: 'Melanerpes formicivorus',
        taxonId: '18216',
        iNatUrl: 'https://www.inaturalist.org/taxa/18216',
        status: 'Resident colony present',
        strataLayer: 'canopy',
        dayPeakHour: 8,
        dayDurationHours: 10,
      },
      {
        id: 'red-tailed-hawk',
        commonName: 'Red-tailed Hawk',
        scientificName: 'Buteo jamaicensis',
        taxonId: '4776',
        iNatUrl: 'https://www.inaturalist.org/taxa/4776',
        status: 'Nesting pair recorded',
        strataLayer: 'canopy',
        dayPeakHour: 10,
        dayDurationHours: 8,
        phenologyCategory: 'breed',
        phenologyPeakWeek: 12,
        phenologyStartWeek: 6,
        phenologyEndWeek: 20,
      },
    ],
  },
  {
    key: 'understory',
    label: 'Understory & Shrubs',
    depthLabel: '1 – 8 m',
    depthM: 4,
    color: '#388e3c',
    textColor: '#f1f8e9',
    description: 'Dense shrub layer of coyote brush and toyon, shelter for sparrows and rabbits.',
    entities: [
      {
        id: 'coyote-brush',
        commonName: 'Coyote Brush',
        scientificName: 'Baccharis pilularis',
        taxonId: '53639',
        iNatUrl: 'https://www.inaturalist.org/taxa/53639',
        status: 'Dominant shrub',
        strataLayer: 'understory',
        phenologyCategory: 'bloom',
        phenologyPeakWeek: 38,
        phenologyStartWeek: 32,
        phenologyEndWeek: 48,
      },
      {
        id: 'toyon',
        commonName: 'Toyon',
        scientificName: 'Heteromeles arbutifolia',
        taxonId: '55729',
        iNatUrl: 'https://www.inaturalist.org/taxa/55729',
        status: 'Common – berries in winter',
        strataLayer: 'understory',
        phenologyCategory: 'fruit',
        phenologyPeakWeek: 50,
        phenologyStartWeek: 44,
        phenologyEndWeek: 6,
      },
      {
        id: 'spotted-towhee',
        commonName: 'Spotted Towhee',
        scientificName: 'Pipilo maculatus',
        taxonId: '145029',
        iNatUrl: 'https://www.inaturalist.org/taxa/145029',
        status: 'Resident, common in brush',
        strataLayer: 'understory',
        dayPeakHour: 7,
        dayDurationHours: 8,
      },
      {
        id: 'california-buckeye',
        commonName: 'California Buckeye',
        scientificName: 'Aesculus californica',
        taxonId: '57110',
        iNatUrl: 'https://www.inaturalist.org/taxa/57110',
        status: 'Blooms May–June, bare in summer',
        strataLayer: 'understory',
        phenologyCategory: 'bloom',
        phenologyPeakWeek: 20,
        phenologyStartWeek: 16,
        phenologyEndWeek: 24,
      },
    ],
  },
  {
    key: 'ground',
    label: 'Ground Layer',
    depthLabel: '0 – 1 m',
    depthM: 0.5,
    color: '#7cb342',
    textColor: '#1b5e20',
    description: 'Wildflowers, grasses, lizards, and ground-nesting birds at your feet.',
    entities: [
      {
        id: 'california-poppy',
        commonName: 'California Poppy',
        scientificName: 'Eschscholzia californica',
        taxonId: '47732',
        iNatUrl: 'https://www.inaturalist.org/taxa/47732',
        status: 'Blooming Feb–Jun',
        strataLayer: 'ground',
        phenologyCategory: 'bloom',
        phenologyPeakWeek: 12,
        phenologyStartWeek: 6,
        phenologyEndWeek: 22,
      },
      {
        id: 'western-fence-lizard',
        commonName: 'Western Fence Lizard',
        scientificName: 'Sceloporus occidentalis',
        taxonId: '40696',
        iNatUrl: 'https://www.inaturalist.org/taxa/40696',
        status: 'Common on rocks and logs',
        strataLayer: 'ground',
        dayPeakHour: 11,
        dayDurationHours: 6,
        phenologyCategory: 'breed',
        phenologyPeakWeek: 18,
        phenologyStartWeek: 14,
        phenologyEndWeek: 28,
      },
      {
        id: 'california-quail',
        commonName: 'California Quail',
        scientificName: 'Callipepla californica',
        taxonId: '4933',
        iNatUrl: 'https://www.inaturalist.org/taxa/4933',
        status: 'Coveys active at dawn',
        strataLayer: 'ground',
        dayPeakHour: 7,
        dayDurationHours: 4,
      },
      {
        id: 'painted-lady',
        commonName: 'Painted Lady',
        scientificName: 'Vanessa cardui',
        taxonId: '55626',
        iNatUrl: 'https://www.inaturalist.org/taxa/55626',
        status: 'Spring migrant',
        strataLayer: 'ground',
        dayPeakHour: 12,
        dayDurationHours: 6,
        phenologyCategory: 'migration',
        phenologyPeakWeek: 14,
        phenologyStartWeek: 10,
        phenologyEndWeek: 22,
      },
    ],
  },
  {
    key: 'soil-surface',
    label: 'Soil Surface',
    depthLabel: 'Leaf litter',
    depthM: 0,
    color: '#8d6e63',
    textColor: '#fbe9e7',
    description: 'Decomposers and fungi breaking down organic matter at the soil surface.',
    entities: [
      {
        id: 'banana-slug',
        commonName: 'Pacific Banana Slug',
        scientificName: 'Ariolimax californicus',
        taxonId: '83194',
        iNatUrl: 'https://www.inaturalist.org/taxa/83194',
        status: 'Active in wet season',
        strataLayer: 'soil-surface',
        dayPeakHour: 6,
        dayDurationHours: 4,
      },
      {
        id: 'cortinarius',
        commonName: 'Cortinarius Mushroom',
        scientificName: 'Cortinarius sp.',
        taxonId: '47169',
        iNatUrl: 'https://www.inaturalist.org/taxa/47169',
        status: 'Fruiting bodies Nov–Feb',
        strataLayer: 'soil-surface',
        phenologyCategory: 'emerge',
        phenologyPeakWeek: 50,
        phenologyStartWeek: 44,
        phenologyEndWeek: 10,
      },
      {
        id: 'sowbug',
        commonName: 'Pillbug / Sowbug',
        scientificName: 'Armadillidium vulgare',
        taxonId: '121805',
        iNatUrl: 'https://www.inaturalist.org/taxa/121805',
        status: 'Year-round in leaf litter',
        strataLayer: 'soil-surface',
      },
    ],
  },
  {
    key: 'upper-soil',
    label: 'Upper Soil',
    depthLabel: '0 – 30 cm',
    depthM: -0.15,
    color: '#6d4c41',
    textColor: '#efebe9',
    description: 'Roots, burrowers, and soil arthropods in the uppermost soil horizon.',
    entities: [
      {
        id: 'botta-pocket-gopher',
        commonName: "Botta's Pocket Gopher",
        scientificName: 'Thomomys bottae',
        taxonId: '46130',
        iNatUrl: 'https://www.inaturalist.org/taxa/46130',
        status: 'Mounds common in open areas',
        strataLayer: 'upper-soil',
        dayPeakHour: 9,
        dayDurationHours: 6,
      },
      {
        id: 'earthworm',
        commonName: 'Common Earthworm',
        scientificName: 'Lumbricus terrestris',
        taxonId: '47220',
        iNatUrl: 'https://www.inaturalist.org/taxa/47220',
        status: 'Active year-round',
        strataLayer: 'upper-soil',
        dayPeakHour: 4,
        dayDurationHours: 8,
      },
      {
        id: 'ground-beetle',
        commonName: 'Ground Beetle',
        scientificName: 'Carabidae sp.',
        taxonId: '47617',
        iNatUrl: 'https://www.inaturalist.org/taxa/47617',
        status: 'Common predator in soil',
        strataLayer: 'upper-soil',
        dayPeakHour: 21,
        dayDurationHours: 6,
      },
    ],
  },
  {
    key: 'mycorrhizal',
    label: 'Mycorrhizal Network',
    depthLabel: '10 – 60 cm',
    depthM: -0.35,
    color: '#4a148c',
    textColor: '#f3e5f5',
    description: 'Fungal hyphae connecting tree roots in the "wood wide web."',
    entities: [
      {
        id: 'pisolithus',
        commonName: 'Dead Man\'s Earthball',
        scientificName: 'Pisolithus arhizus',
        taxonId: '117847',
        iNatUrl: 'https://www.inaturalist.org/taxa/117847',
        status: 'Ectomycorrhizal with oaks',
        strataLayer: 'mycorrhizal',
        phenologyCategory: 'emerge',
        phenologyPeakWeek: 46,
        phenologyStartWeek: 40,
        phenologyEndWeek: 4,
      },
      {
        id: 'rhizopogon',
        commonName: 'False Truffle',
        scientificName: 'Rhizopogon sp.',
        taxonId: '48536',
        iNatUrl: 'https://www.inaturalist.org/taxa/48536',
        status: 'Hypogeous – forms oak networks',
        strataLayer: 'mycorrhizal',
      },
      {
        id: 'amanita-francheti',
        commonName: 'Franchets Amanita',
        scientificName: 'Amanita franchetii',
        taxonId: '51631',
        iNatUrl: 'https://www.inaturalist.org/taxa/51631',
        status: 'Mycorrhizal with live oak',
        strataLayer: 'mycorrhizal',
        phenologyCategory: 'emerge',
        phenologyPeakWeek: 48,
        phenologyStartWeek: 42,
        phenologyEndWeek: 8,
      },
    ],
  },
  {
    key: 'bedrock',
    label: 'Bedrock & Geology',
    depthLabel: '> 1 m',
    depthM: -5,
    color: '#37474f',
    textColor: '#eceff1',
    description: 'Franciscan Complex – chert and greenstone from an ancient Pacific seafloor.',
    entities: [
      {
        id: 'radiolarian-chert',
        commonName: 'Radiolarian Chert',
        scientificName: 'Franciscan Complex',
        status: '150–165 Ma — compressed deep-sea sediment',
        strataLayer: 'bedrock',
      },
      {
        id: 'serpentinite',
        commonName: 'Serpentinite',
        scientificName: 'Antigorite / Chrysotile',
        status: 'State rock of California — from oceanic mantle',
        strataLayer: 'bedrock',
      },
      {
        id: 'greenstone',
        commonName: 'Greenstone (Metabasalt)',
        scientificName: 'Franciscan metabasalt',
        status: 'Ancient ocean crust — Jurassic',
        strataLayer: 'bedrock',
      },
    ],
  },
];
// ---------------------------------------------------------------------------
// Day activity entities (with peak hour)
// ---------------------------------------------------------------------------
const MOCK_DAY_ENTITIES = [
  {
    id: 'great-horned-owl',
    commonName: 'Great Horned Owl',
    scientificName: 'Bubo virginianus',
    taxonId: '4849',
    iNatUrl: 'https://www.inaturalist.org/taxa/4849',
    status: 'Resident',
    dayPeakHour: 22,
    dayDurationHours: 6,
  },
  {
    id: 'barn-owl',
    commonName: 'Barn Owl',
    scientificName: 'Tyto alba',
    taxonId: '4849',
    iNatUrl: 'https://www.inaturalist.org/taxa/4849',
    status: 'Resident',
    dayPeakHour: 23,
    dayDurationHours: 5,
  },
  {
    id: 'california-quail-day',
    commonName: 'California Quail',
    scientificName: 'Callipepla californica',
    taxonId: '4933',
    iNatUrl: 'https://www.inaturalist.org/taxa/4933',
    status: 'Dawn forager',
    dayPeakHour: 7,
    dayDurationHours: 4,
  },
  {
    id: 'turkey-vulture-day',
    commonName: 'Turkey Vulture',
    scientificName: 'Cathartes aura',
    taxonId: '4756',
    iNatUrl: 'https://www.inaturalist.org/taxa/4756',
    status: 'Thermals after 10 am',
    dayPeakHour: 11,
    dayDurationHours: 8,
  },
  {
    id: 'painted-lady-day',
    commonName: 'Painted Lady',
    scientificName: 'Vanessa cardui',
    taxonId: '55626',
    iNatUrl: 'https://www.inaturalist.org/taxa/55626',
    status: 'Midday nectaring',
    dayPeakHour: 12,
    dayDurationHours: 6,
  },
  {
    id: 'acorn-woodpecker-day',
    commonName: 'Acorn Woodpecker',
    scientificName: 'Melanerpes formicivorus',
    taxonId: '18216',
    iNatUrl: 'https://www.inaturalist.org/taxa/18216',
    status: 'Active all day',
    dayPeakHour: 9,
    dayDurationHours: 10,
  },
  {
    id: 'botta-gopher-day',
    commonName: "Botta's Pocket Gopher",
    scientificName: 'Thomomys bottae',
    taxonId: '46130',
    iNatUrl: 'https://www.inaturalist.org/taxa/46130',
    status: 'Morning excavator',
    dayPeakHour: 9,
    dayDurationHours: 6,
  },
  {
    id: 'raccoon',
    commonName: 'Raccoon',
    scientificName: 'Procyon lotor',
    taxonId: '42048',
    iNatUrl: 'https://www.inaturalist.org/taxa/42048',
    status: 'Crepuscular / nocturnal',
    dayPeakHour: 21,
    dayDurationHours: 5,
  },
  {
    id: 'coyote',
    commonName: 'Coyote',
    scientificName: 'Canis latrans',
    taxonId: '41654',
    iNatUrl: 'https://www.inaturalist.org/taxa/41654',
    status: 'Dusk and dawn',
    dayPeakHour: 5,
    dayDurationHours: 3,
  },
  {
    id: 'western-fence-lizard-day',
    commonName: 'Western Fence Lizard',
    scientificName: 'Sceloporus occidentalis',
    taxonId: '40696',
    iNatUrl: 'https://www.inaturalist.org/taxa/40696',
    status: 'Basks midday',
    dayPeakHour: 11,
    dayDurationHours: 6,
  },
  {
    id: 'banana-slug-day',
    commonName: 'Pacific Banana Slug',
    scientificName: 'Ariolimax californicus',
    taxonId: '83194',
    iNatUrl: 'https://www.inaturalist.org/taxa/83194',
    status: 'Dawn forager',
    dayPeakHour: 5,
    dayDurationHours: 4,
  },
  {
    id: 'hoary-bat',
    commonName: 'Hoary Bat',
    scientificName: 'Lasiurus cinereus',
    taxonId: '43325',
    iNatUrl: 'https://www.inaturalist.org/taxa/43325',
    status: 'Migratory — evening forager',
    dayPeakHour: 20,
    dayDurationHours: 4,
  },
];
// ---------------------------------------------------------------------------
// Phenology entries
// ---------------------------------------------------------------------------
const MOCK_PHENOLOGY_ENTITIES = [
  // Bloom
  {
    id: 'pheno-poppy',
    commonName: 'California Poppy',
    scientificName: 'Eschscholzia californica',
    taxonId: '47732',
    iNatUrl: 'https://www.inaturalist.org/taxa/47732',
    phenologyCategory: 'bloom',
    phenologyPeakWeek: 12,
    phenologyStartWeek: 6,
    phenologyEndWeek: 22,
  },
  {
    id: 'pheno-mustard',
    commonName: 'Black Mustard',
    scientificName: 'Brassica nigra',
    taxonId: '53413',
    iNatUrl: 'https://www.inaturalist.org/taxa/53413',
    phenologyCategory: 'bloom',
    phenologyPeakWeek: 8,
    phenologyStartWeek: 4,
    phenologyEndWeek: 16,
  },
  {
    id: 'pheno-buckeye',
    commonName: 'California Buckeye',
    scientificName: 'Aesculus californica',
    taxonId: '57110',
    iNatUrl: 'https://www.inaturalist.org/taxa/57110',
    phenologyCategory: 'bloom',
    phenologyPeakWeek: 20,
    phenologyStartWeek: 16,
    phenologyEndWeek: 24,
  },
  {
    id: 'pheno-coyote-brush',
    commonName: 'Coyote Brush',
    scientificName: 'Baccharis pilularis',
    taxonId: '53639',
    iNatUrl: 'https://www.inaturalist.org/taxa/53639',
    phenologyCategory: 'bloom',
    phenologyPeakWeek: 38,
    phenologyStartWeek: 32,
    phenologyEndWeek: 48,
  },
  // Migration
  {
    id: 'pheno-painted-lady',
    commonName: 'Painted Lady Butterfly',
    scientificName: 'Vanessa cardui',
    taxonId: '55626',
    iNatUrl: 'https://www.inaturalist.org/taxa/55626',
    phenologyCategory: 'migration',
    phenologyPeakWeek: 14,
    phenologyStartWeek: 10,
    phenologyEndWeek: 22,
  },
  {
    id: 'pheno-white-crowned-sparrow',
    commonName: 'White-crowned Sparrow',
    scientificName: 'Zonotrichia leucophrys',
    taxonId: '145046',
    iNatUrl: 'https://www.inaturalist.org/taxa/145046',
    phenologyCategory: 'migration',
    phenologyPeakWeek: 42,
    phenologyStartWeek: 38,
    phenologyEndWeek: 52,
  },
  {
    id: 'pheno-monarch',
    commonName: 'Monarch Butterfly',
    scientificName: 'Danaus plexippus',
    taxonId: '48662',
    iNatUrl: 'https://www.inaturalist.org/taxa/48662',
    phenologyCategory: 'migration',
    phenologyPeakWeek: 40,
    phenologyStartWeek: 35,
    phenologyEndWeek: 48,
  },
  // Breed
  {
    id: 'pheno-red-tailed-hawk',
    commonName: 'Red-tailed Hawk',
    scientificName: 'Buteo jamaicensis',
    taxonId: '4776',
    iNatUrl: 'https://www.inaturalist.org/taxa/4776',
    phenologyCategory: 'breed',
    phenologyPeakWeek: 12,
    phenologyStartWeek: 6,
    phenologyEndWeek: 20,
  },
  {
    id: 'pheno-hummingbird',
    commonName: "Anna's Hummingbird",
    scientificName: 'Calypte anna',
    taxonId: '4849',
    iNatUrl: 'https://www.inaturalist.org/taxa/4849',
    phenologyCategory: 'breed',
    phenologyPeakWeek: 8,
    phenologyStartWeek: 2,
    phenologyEndWeek: 18,
  },
  {
    id: 'pheno-fence-lizard',
    commonName: 'Western Fence Lizard',
    scientificName: 'Sceloporus occidentalis',
    taxonId: '40696',
    iNatUrl: 'https://www.inaturalist.org/taxa/40696',
    phenologyCategory: 'breed',
    phenologyPeakWeek: 18,
    phenologyStartWeek: 14,
    phenologyEndWeek: 28,
  },
  // Fruit
  {
    id: 'pheno-toyon',
    commonName: 'Toyon (berries)',
    scientificName: 'Heteromeles arbutifolia',
    taxonId: '55729',
    iNatUrl: 'https://www.inaturalist.org/taxa/55729',
    phenologyCategory: 'fruit',
    phenologyPeakWeek: 50,
    phenologyStartWeek: 44,
    phenologyEndWeek: 6,
  },
  {
    id: 'pheno-elderberry',
    commonName: 'Blue Elderberry',
    scientificName: 'Sambucus nigra caerulea',
    taxonId: '55820',
    iNatUrl: 'https://www.inaturalist.org/taxa/55820',
    phenologyCategory: 'fruit',
    phenologyPeakWeek: 32,
    phenologyStartWeek: 26,
    phenologyEndWeek: 38,
  },
  // Hibernate / emerge
  {
    id: 'pheno-gopher-snake',
    commonName: 'Gopher Snake',
    scientificName: 'Pituophis catenifer',
    taxonId: '46075',
    iNatUrl: 'https://www.inaturalist.org/taxa/46075',
    phenologyCategory: 'hibernate',
    phenologyPeakWeek: 50,
    phenologyStartWeek: 44,
    phenologyEndWeek: 8,
  },
  {
    id: 'pheno-mushrooms',
    commonName: 'Cortinarius Mushrooms',
    scientificName: 'Cortinarius sp.',
    taxonId: '47169',
    iNatUrl: 'https://www.inaturalist.org/taxa/47169',
    phenologyCategory: 'emerge',
    phenologyPeakWeek: 50,
    phenologyStartWeek: 44,
    phenologyEndWeek: 10,
  },
];
// ---------------------------------------------------------------------------
// Deep Time eras
// ---------------------------------------------------------------------------
const MOCK_DEEP_TIME_ERAS = [
  {
    label: 'Today',
    yearsAgo: 0,
    yearsAgoDisplay: 'Present',
    environment: 'Coast live oak woodland & coastal scrub',
    color: '#4caf50',
    narrative: 'You stand in the ancestral territory of the Ohlone people, in a mosaic of coast live oak woodland, coastal scrub, and introduced annual grassland. The hills are shaped by the Hayward Fault, which runs just to the east. San Francisco Bay stretches to the northwest, its marshes filtering tidal flows. Red-tailed hawks circle on thermals; California poppies carpet south-facing slopes in spring.',
    fossils: [],
  },
  {
    label: '10,000 years ago',
    yearsAgo: 10000,
    yearsAgoDisplay: '10 kya',
    environment: 'Post-glacial grassland — sea level 60 m lower',
    color: '#8bc34a',
    narrative: 'The last glacial period is ending. Sea level is roughly 60 m lower — San Francisco Bay does not exist; the Sacramento and San Joaquin Rivers flow through a broad river valley across the present bay floor. Tule elk, pronghorn, and grizzly bears roam the surrounding grasslands. The Ohlone\'s ancestors are settling along the bay margins, gathering shellfish and hunting with atlatls. Mammoths vanished here only recently.',
    fossils: [
      { name: 'Tule Elk', taxon: 'Cervus canadensis nannodes', ageDisplay: '~8 kya' },
      { name: 'Columbian Mammoth', taxon: 'Mammuthus columbi', ageDisplay: '~10 kya' },
    ],
  },
  {
    label: '100,000 years ago',
    yearsAgo: 100000,
    yearsAgoDisplay: '100 kya',
    environment: 'Last glacial maximum — savanna & megafauna',
    color: '#cddc39',
    narrative: 'Marine Isotope Stage 6 — deep glacial cold. Ice sheets lock up sea water; the Bay Area is cooler and wetter. Massive Columbian Mammoths browse oak woodlands; saber-toothed cats (Smilodon fatalis) ambush ground sloths in the valleys below. Western horses and camels still roam these hills. The hills themselves look recognisably similar — the same Franciscan chert ridges, the same orientation — but the vegetation is an open savanna unlike anything alive today in California.',
    fossils: [
      { name: 'Smilodon (Saber-tooth)', taxon: 'Smilodon fatalis', ageDisplay: '~120 kya' },
      { name: 'Western Horse', taxon: 'Equus occidentalis', ageDisplay: '~100 kya' },
      { name: 'Giant Ground Sloth', taxon: 'Megalonyx jeffersonii', ageDisplay: '~100 kya' },
    ],
  },
  {
    label: '1 million years ago',
    yearsAgo: 1000000,
    yearsAgoDisplay: '1 Mya',
    environment: 'Early Pleistocene — Pleistocene megafauna & proto-Bay',
    color: '#ffeb3b',
    narrative: 'The Bay Area topography is broadly recognisable but the drainage network is different — the proto-San Francisco Bay has not yet been carved by glacial sea-level fluctuations. Dire wolves, American mastodons, and giant short-faced bears roam a landscape of mixed chaparral and oak woodland. The Hayward and San Andreas Faults are already active, steadily uplifting these hills.',
    fossils: [
      { name: 'Dire Wolf', taxon: 'Aenocyon dirus', ageDisplay: '~1 Mya' },
      { name: 'American Mastodon', taxon: 'Mammut americanum', ageDisplay: '~1 Mya' },
      { name: 'Giant Short-faced Bear', taxon: 'Arctodus simus', ageDisplay: '~1 Mya' },
    ],
  },
  {
    label: '10 million years ago',
    yearsAgo: 10000000,
    yearsAgoDisplay: '10 Mya',
    environment: 'Miocene — warm savanna, strange mammals',
    color: '#ff9800',
    narrative: 'The Miocene is warmer and drier than today. The Sierra Nevada is lower; the Central Valley is a broad inland sea draining to the ocean near Monterey. Here, on the margin of the proto-Coast Ranges, grazed three-toed horses (Merychippus), short-necked rhinoceroses (Teleoceras), and gomphotheres (elephant relatives). The oak lineage is present but the species would be unfamiliar. The Pacific Plate is sliding north, beginning to bend the coast into its modern "Big Bend."',
    fossils: [
      { name: 'Three-toed Horse', taxon: 'Merychippus insignis', ageDisplay: '~10 Mya' },
      { name: 'Teleoceras Rhinoceros', taxon: 'Teleoceras major', ageDisplay: '~10 Mya' },
    ],
  },
  {
    label: '100 million years ago',
    yearsAgo: 100000000,
    yearsAgoDisplay: '100 Mya',
    environment: 'Cretaceous — deep ocean subduction zone',
    color: '#ff5722',
    narrative: 'California does not yet exist. You are standing at the base of a deep oceanic trench where the Farallon Plate is diving beneath the North American continent. The sediments and ocean-floor basalts that will become the Franciscan Complex beneath your feet — the chert and greenstone you see exposed in the hills — are being scraped off the subducting plate and accreted onto the continent\'s edge. Inland, dinosaurs browse a subtropical forest; mosasaurs and plesiosaurs swim in the warm Cretaceous sea.',
    fossils: [
      { name: 'Inoceramus (Giant Clam)', taxon: 'Inoceramus sp.', ageDisplay: '~100 Mya' },
      { name: 'Ammonite', taxon: 'Parapuzosia sp.', ageDisplay: '~90 Mya' },
    ],
  },
  {
    label: '500 million years ago',
    yearsAgo: 500000000,
    yearsAgoDisplay: '500 Mya',
    environment: 'Cambrian — open Panthalassa Ocean',
    color: '#9c27b0',
    narrative: 'The rocks beneath your feet have not formed yet. The materials that will eventually become them are being deposited as fine siliceous ooze on the floor of the vast Panthalassa Ocean — the ancient global sea that preceded the Pacific. North America is near the equator, part of the supercontinent Gondwana\'s margin. The Cambrian Explosion has recently filled the seas with the first animals bearing hard parts: trilobites, brachiopods, echinoderms, and the ancestors of every vertebrate alive today.',
    fossils: [
      { name: 'Trilobite', taxon: 'Olenellus sp.', ageDisplay: '~520 Mya' },
      { name: 'Brachiopod', taxon: 'Nisusia sp.', ageDisplay: '~510 Mya' },
      { name: 'Radiolarian', taxon: 'Cambrian radiolarian', ageDisplay: '~500 Mya' },
    ],
  },
];

const hereViewCss = ":host{display:block;width:100%;height:100%}.loading{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#0d1f2d;color:#78909c;font-size:14px;gap:16px}.loading p{margin:0}.loading__spinner{width:36px;height:36px;border:3px solid rgba(79, 195, 247, 0.2);border-top-color:#4fc3f7;border-radius:50%;animation:spin 0.8s linear infinite}.here-shell{display:flex;flex-direction:column;height:100vh;background:#0d1f2d;overflow:hidden}.mode-panel{flex:1;overflow:hidden;display:flex;flex-direction:column;animation:fadeIn 0.2s ease}.mode-panel here-strata,.mode-panel here-day-wheel,.mode-panel here-phenology-wheel,.mode-panel here-deep-time{flex:1;overflow-y:auto;overflow-x:hidden;display:block}@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}";

const HereView = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.activeMode = 'strata';
    this.locationContext = null;
    this.loading = true;
  }
  async componentWillLoad() {
    // Attempt Geolocation API; fall back to mock data
    await this.initLocation();
    // Refresh clock every minute
    setInterval(() => {
      if (this.locationContext) {
        this.locationContext = Object.assign(Object.assign({}, this.locationContext), { localTime: new Date() });
      }
    }, 60000);
  }
  async initLocation() {
    try {
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        // TODO: reverse-geocode position to get a place name (e.g., via Nominatim or Esri geocoder)
        const now = new Date();
        this.locationContext = {
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: 'Your Location',
          },
          localTime: now,
          weekOfYear: this.getWeekOfYear(now),
        };
      }
      else {
        this.locationContext = Object.assign(Object.assign({}, MOCK_LOCATION), { localTime: new Date() });
      }
    }
    catch (_a) {
      // Geolocation denied or unavailable — use mock data
      this.locationContext = Object.assign(Object.assign({}, MOCK_LOCATION), { localTime: new Date() });
    }
    this.loading = false;
  }
  getWeekOfYear(d) {
    const start = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((d.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
  }
  handleModeChange(e) {
    this.activeMode = e.detail;
  }
  renderModePanel() {
    var _a, _b;
    switch (this.activeMode) {
      case 'strata':
        return (index.h("here-strata", { layers: MOCK_STRATA_LAYERS }));
      case 'day':
        return (index.h("here-day-wheel", { entities: MOCK_DAY_ENTITIES, localTime: (_a = this.locationContext) === null || _a === void 0 ? void 0 : _a.localTime }));
      case 'phenology':
        return (index.h("here-phenology-wheel", { entities: MOCK_PHENOLOGY_ENTITIES, currentWeek: ((_b = this.locationContext) === null || _b === void 0 ? void 0 : _b.weekOfYear) || 1 }));
      case 'deep-time':
        return (index.h("here-deep-time", { eras: MOCK_DEEP_TIME_ERAS }));
      default:
        return null;
    }
  }
  render() {
    if (this.loading) {
      return (index.h("div", { class: "loading" }, index.h("div", { class: "loading__spinner", "aria-label": "Loading\u2026" }), index.h("p", null, "Finding your place in the world\u2026")));
    }
    return (index.h("div", { class: "here-shell" }, index.h("location-bar", { context: this.locationContext }), index.h("here-mode-switcher", { activeMode: this.activeMode, onModeChange: this.handleModeChange.bind(this) }), index.h("main", { class: `mode-panel mode-panel--${this.activeMode}`, "aria-live": "polite" }, this.renderModePanel())));
  }
};
HereView.style = hereViewCss;

const locationBarCss = ":host{display:block;width:100%}.location-bar{display:flex;flex-direction:column;gap:4px;padding:10px 16px;background:#1a2a3a;color:#e0f2fe;font-size:13px;line-height:1.4}.place{display:flex;align-items:center;gap:4px;font-size:15px;font-weight:600}.place .name{color:#ffffff}.place .subname{color:#90caf9;font-weight:400}.meta{display:flex;flex-wrap:wrap;gap:12px;align-items:center;color:#b0bec5;font-size:12px}.weather-item,.meta-item{display:flex;align-items:center;gap:4px}.weather-item .desc,.meta-item .desc{color:#90a4ae}.coords{margin-left:auto;font-size:11px;color:#607d8b;font-family:monospace}";

const LocationBar = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.context = undefined;
  }
  render() {
    if (!this.context)
      return null;
    const { location, weather, localTime, weekOfYear } = this.context;
    const timeStr = (localTime || new Date()).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return (index.h("div", { class: "location-bar" }, index.h("div", { class: "place" }, index.h("span", { class: "pin", "aria-hidden": "true" }, "\uD83D\uDCCD"), index.h("span", { class: "name" }, location.name), location.placeName && (index.h("span", { class: "subname" }, "\u00A0\u00B7\u00A0", location.placeName))), index.h("div", { class: "meta" }, weather && (index.h("span", { class: "weather-item" }, index.h("span", { "aria-hidden": "true" }, weather.icon), index.h("span", null, weather.tempC, "\u00B0C"), index.h("span", { class: "desc" }, weather.description))), index.h("span", { class: "meta-item" }, index.h("span", { "aria-hidden": "true" }, "\uD83D\uDD50"), index.h("span", null, timeStr)), index.h("span", { class: "meta-item" }, index.h("span", { "aria-hidden": "true" }, "\uD83D\uDCC5"), index.h("span", null, "Week ", weekOfYear)), index.h("span", { class: "coords" }, location.lat.toFixed(4), "\u00B0N, ", Math.abs(location.lng).toFixed(4), "\u00B0W"))));
  }
};
LocationBar.style = locationBarCss;

exports.here_day_wheel = HereDayWheel;
exports.here_deep_time = HereDeepTime;
exports.here_mode_switcher = HereModeSwitcher;
exports.here_phenology_wheel = HerePhenologyWheel;
exports.here_strata = HereStrata;
exports.here_view = HereView;
exports.location_bar = LocationBar;

//# sourceMappingURL=here-day-wheel_7.cjs.entry.js.map