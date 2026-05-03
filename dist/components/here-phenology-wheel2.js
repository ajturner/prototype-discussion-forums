import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

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
const HerePhenologyWheel = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
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
      return (h("text", { key: `month-${i}`, x: pos.x.toFixed(2), y: pos.y.toFixed(2), "text-anchor": "middle", "dominant-baseline": "central", "font-size": "9", fill: "rgba(255,255,255,0.55)", "font-family": "sans-serif" }, label));
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
    return h("path", { d: path, fill: "rgba(255,255,255,0.18)", stroke: "white", "stroke-width": "1.5" });
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
      return (h("path", { key: entity.id, d: d, fill: color, opacity: isSelected ? 1 : 0.65, stroke: isSelected ? 'white' : 'transparent', "stroke-width": isSelected ? '2' : '0', class: "entity-arc", onClick: () => { var _a; this.selectedEntity = ((_a = this.selectedEntity) === null || _a === void 0 ? void 0 : _a.id) === entity.id ? null : entity; }, "aria-label": entity.commonName, role: "button" }));
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
    return (h("g", null, h("text", { x: cx.toFixed(2), y: (cy - 18).toFixed(2), "text-anchor": "middle", "font-size": "22", "font-weight": "700", fill: "#ffffff", "font-family": "sans-serif" }, "Wk ", this.currentWeek), h("text", { x: cx.toFixed(2), y: (cy + 4).toFixed(2), "text-anchor": "middle", "font-size": "10", fill: "rgba(255,255,255,0.6)", "font-family": "sans-serif" }, active.length, " active"), h("text", { x: cx.toFixed(2), y: (cy + 18).toFixed(2), "text-anchor": "middle", "font-size": "9", fill: "rgba(255,255,255,0.35)", "font-family": "sans-serif" }, "this week")));
  }
  render() {
    const cx = 250, cy = 250;
    const svgSize = 500;
    const outerMost = 210;
    const innerMost = 30;
    const labelR = 228;
    return (h("div", { class: "phenology-view" }, h("div", { class: "filters" }, Object.keys(CATEGORY_COLORS).map(cat => (h("button", { key: cat, class: `filter-pill ${this.activeFilters.has(cat) ? 'filter-pill--active' : ''}`, style: { '--cat-color': CATEGORY_COLORS[cat] }, onClick: () => this.toggleFilter(cat), "aria-pressed": String(this.activeFilters.has(cat)) }, cat)))), h("div", { class: "wheel-container" }, h("svg", { viewBox: `0 0 ${svgSize} ${svgSize}`, class: "wheel-svg", role: "img", "aria-label": "Phenology wheel showing seasonal activity across the year" }, h("title", null, "Annual phenology wheel: each arc shows when organisms bloom, migrate, breed, fruit, hibernate, or emerge"), h("circle", { cx: cx, cy: cy, r: outerMost + 8, fill: "#0d1f2d" }), Object.entries(CATEGORY_RADII).map(([cat, [ir, or_]]) => (h("circle", { key: `bg-${cat}`, cx: cx, cy: cy, r: (ir + or_) / 2, fill: "none", stroke: CATEGORY_COLORS[cat], "stroke-width": (or_ - ir).toString(), opacity: "0.07" }))), this.renderEntityArcs(cx, cy), this.renderCurrentWeekSlice(cx, cy, innerMost, outerMost), this.renderMonthLabels(cx, cy, labelR), h("circle", { cx: cx, cy: cy, r: innerMost - 2, fill: "#0d1f2d" }), this.renderCenterSummary(cx, cy, innerMost))), h("div", { class: "legend" }, Object.entries(CATEGORY_COLORS).map(([cat, color]) => (h("div", { key: cat, class: "legend__item" }, h("span", { class: "legend__swatch", style: { background: color } }), h("span", { class: "legend__label" }, cat))))), this.selectedEntity && (h("div", { class: "detail-panel" }, h("div", { class: "detail-panel__header" }, h("div", { class: "detail-panel__cat-dot", style: { background: CATEGORY_COLORS[this.selectedEntity.phenologyCategory] } }), h("h3", null, this.selectedEntity.commonName), h("span", { class: "detail-panel__sci" }, this.selectedEntity.scientificName), h("button", { class: "detail-panel__close", onClick: () => { this.selectedEntity = null; } }, "\u2715")), h("p", { class: "detail-panel__meta" }, "Category: ", h("strong", null, this.selectedEntity.phenologyCategory), this.selectedEntity.phenologyPeakWeek && ` · Peak: week ${this.selectedEntity.phenologyPeakWeek}`), this.selectedEntity.phenologyStartWeek && this.selectedEntity.phenologyEndWeek && (h("p", { class: "detail-panel__meta" }, "Season: weeks ", this.selectedEntity.phenologyStartWeek, "\u2013", this.selectedEntity.phenologyEndWeek)), this.selectedEntity.iNatUrl && (h("a", { href: this.selectedEntity.iNatUrl, target: "_blank", rel: "noopener noreferrer", class: "detail-panel__link" }, "View on iNaturalist \u2192")))), h("div", { class: "active-now" }, h("h4", { class: "active-now__title" }, "Active this week (week ", this.currentWeek, ")"), h("div", { class: "active-now__list" }, this.entities
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
      return (h("button", { key: e.id, class: `active-chip ${((_a = this.selectedEntity) === null || _a === void 0 ? void 0 : _a.id) === e.id ? 'active-chip--selected' : ''}`, style: { '--cat-color': CATEGORY_COLORS[e.phenologyCategory] }, onClick: () => { var _a; this.selectedEntity = ((_a = this.selectedEntity) === null || _a === void 0 ? void 0 : _a.id) === e.id ? null : e; } }, e.commonName));
    })))));
  }
  static get style() { return herePhenologyWheelCss; }
}, [1, "here-phenology-wheel", {
    "entities": [16],
    "currentWeek": [2, "current-week"],
    "selectedEntity": [32],
    "activeFilters": [32]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["here-phenology-wheel"];
  components.forEach(tagName => { switch (tagName) {
    case "here-phenology-wheel":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, HerePhenologyWheel);
      }
      break;
  } });
}

export { HerePhenologyWheel as H, defineCustomElement as d };

//# sourceMappingURL=here-phenology-wheel2.js.map