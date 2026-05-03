import { h } from '@stencil/core';
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
export class HerePhenologyWheel {
  constructor() {
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
  static get is() { return "here-phenology-wheel"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["here-phenology-wheel.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["here-phenology-wheel.css"]
    };
  }
  static get properties() {
    return {
      "entities": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Entity[]",
          "resolved": "Entity[]",
          "references": {
            "Entity": {
              "location": "import",
              "path": "../../types"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Entities with phenology information"
        },
        "defaultValue": "[]"
      },
      "currentWeek": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Current week of year (1-52)"
        },
        "attribute": "current-week",
        "reflect": false,
        "defaultValue": "1"
      }
    };
  }
  static get states() {
    return {
      "selectedEntity": {},
      "activeFilters": {}
    };
  }
}
//# sourceMappingURL=here-phenology-wheel.js.map
