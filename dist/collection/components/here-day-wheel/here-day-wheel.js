import { h } from '@stencil/core';
/** Returns the SVG angle (radians) for a given hour (0-23), with midnight at top */
function hourToAngle(hour, minute = 0) {
  return ((hour + minute / 60) / 24) * 2 * Math.PI - Math.PI / 2;
}
/** Convert polar coordinates to Cartesian */
function polar(cx, cy, r, angle) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}
/** Build an SVG donut segment path for a time range (hours, 0-24) */
function donutSegment(cx, cy, innerR, outerR, startHour, endHour) {
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
export class HereDayWheel {
  constructor() {
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
    const outer = polar(cx, cy, outerR + 14, angle);
    return (h("line", { x1: cx.toFixed(2), y1: cy.toFixed(2), x2: outer.x.toFixed(2), y2: outer.y.toFixed(2), stroke: "#f44336", "stroke-width": "2.5", "stroke-linecap": "round", opacity: "0.9" }));
  }
  renderHourLabels(cx, cy, r) {
    const labels = [0, 3, 6, 9, 12, 15, 18, 21];
    return labels.map(hr => {
      const angle = hourToAngle(hr);
      const pos = polar(cx, cy, r, angle);
      return (h("text", { key: `lbl-${hr}`, x: pos.x.toFixed(2), y: pos.y.toFixed(2), "text-anchor": "middle", "dominant-baseline": "central", "font-size": "11", fill: "rgba(255,255,255,0.6)", "font-family": "sans-serif" }, hr === 0 ? '12am' : hr === 12 ? '12pm' : hr < 12 ? `${hr}am` : `${hr - 12}pm`));
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
      const pos = polar(cx, cy, r, angle);
      const isSelected = ((_a = this.selectedEntity) === null || _a === void 0 ? void 0 : _a.id) === entity.id;
      return (h("g", { key: entity.id, class: "entity-marker", onClick: () => this.handleEntityClick(entity), role: "button", "aria-label": `${entity.commonName}, peak ${hour}:00` }, h("circle", { cx: pos.x.toFixed(2), cy: pos.y.toFixed(2), r: isSelected ? '12' : '9', fill: isSelected ? '#f44336' : 'rgba(255,255,255,0.85)', stroke: isSelected ? '#b71c1c' : 'rgba(0,0,0,0.3)', "stroke-width": "1", class: "entity-marker__dot" }), h("text", { x: pos.x.toFixed(2), y: pos.y.toFixed(2), "text-anchor": "middle", "dominant-baseline": "central", "font-size": isSelected ? '11' : '9', fill: isSelected ? '#fff' : '#333', style: { pointerEvents: 'none' } }, entity.commonName.charAt(0))));
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
    return (h("g", null, h("text", { x: cx.toFixed(2), y: (cy - 16).toFixed(2), "text-anchor": "middle", "dominant-baseline": "central", "font-size": "20", "font-weight": "700", fill: "#ffffff", "font-family": "sans-serif" }, displayHour, ":", mins, period), h("text", { x: cx.toFixed(2), y: (cy + 8).toFixed(2), "text-anchor": "middle", "dominant-baseline": "central", "font-size": "9", fill: "rgba(255,255,255,0.5)", "font-family": "sans-serif" }, activeNow.length > 0
      ? `${activeNow.length} active now`
      : 'quiet hour')));
  }
  render() {
    const cx = 200, cy = 200;
    const outerR = 155, innerR = 75, markerR = 170;
    const svgSize = 400;
    return (h("div", { class: "day-wheel-view" }, h("div", { class: "wheel-container" }, h("svg", { viewBox: `0 0 ${svgSize} ${svgSize}`, class: "wheel-svg", role: "img", "aria-label": "24-hour activity wheel" }, h("title", null, "24-hour activity wheel showing when organisms are most active"), h("circle", { cx: cx, cy: cy, r: outerR + 20, fill: "#0d1f2d" }), Array.from({ length: 24 }, (_, hr) => (h("path", { key: `seg-${hr}`, d: donutSegment(cx, cy, innerR, outerR, hr, hr + 1), fill: hourColor(hr), stroke: "#0d1f2d", "stroke-width": "0.5", opacity: "0.85" }))), Array.from({ length: 24 }, (_, hr) => {
      const angle = hourToAngle(hr);
      const innerPt = polar(cx, cy, innerR, angle);
      const outerPt = polar(cx, cy, outerR, angle);
      return (h("line", { key: `line-${hr}`, x1: innerPt.x.toFixed(2), y1: innerPt.y.toFixed(2), x2: outerPt.x.toFixed(2), y2: outerPt.y.toFixed(2), stroke: "#0d1f2d", "stroke-width": "0.8", opacity: "0.4" }));
    }), h("circle", { cx: cx, cy: cy, r: innerR, fill: "#0d1f2d" }), this.renderHourLabels(cx, cy, outerR + 32), this.renderEntityMarkers(cx, cy, markerR), this.renderNowHand(cx, cy, innerR, outerR), this.renderCenterInfo(cx, cy, innerR))), h("div", { class: "entity-list" }, h("h4", { class: "entity-list__title" }, "Activity by hour"), h("div", { class: "entity-list__items" }, this.entities
      .filter(e => e.dayPeakHour !== undefined)
      .sort((a, b) => a.dayPeakHour - b.dayPeakHour)
      .map(entity => {
      var _a;
      const hr = entity.dayPeakHour;
      const isSelected = ((_a = this.selectedEntity) === null || _a === void 0 ? void 0 : _a.id) === entity.id;
      return (h("button", { key: entity.id, class: `entity-row ${isSelected ? 'entity-row--selected' : ''}`, onClick: () => this.handleEntityClick(entity) }, h("span", { class: "entity-row__hour" }, hr, ":00"), h("span", { class: "entity-row__name" }, entity.commonName), h("span", { class: "entity-row__sci" }, entity.scientificName)));
    }))), this.selectedEntity && (h("div", { class: "detail-panel" }, h("div", { class: "detail-panel__header" }, h("h3", null, this.selectedEntity.commonName), h("span", { class: "detail-panel__sci" }, this.selectedEntity.scientificName), h("button", { class: "detail-panel__close", onClick: () => { this.selectedEntity = null; } }, "\u2715")), this.selectedEntity.status && (h("p", { class: "detail-panel__status" }, this.selectedEntity.status)), h("p", { class: "detail-panel__time" }, "Peak activity: ", h("strong", null, this.selectedEntity.dayPeakHour, ":00"), this.selectedEntity.dayDurationHours && ` · active for ~${this.selectedEntity.dayDurationHours}h`), this.selectedEntity.iNatUrl && (h("a", { href: this.selectedEntity.iNatUrl, target: "_blank", rel: "noopener noreferrer", class: "detail-panel__link" }, "View on iNaturalist \u2192")))), h("div", { class: "legend" }, h("div", { class: "legend__item" }, h("span", { class: "legend__swatch", style: { background: '#0a1628' } }), "Night"), h("div", { class: "legend__item" }, h("span", { class: "legend__swatch", style: { background: '#bf5a2e' } }), "Dawn"), h("div", { class: "legend__item" }, h("span", { class: "legend__swatch", style: { background: '#4fc3f7' } }), "Day"), h("div", { class: "legend__item" }, h("span", { class: "legend__swatch", style: { background: '#e64a19' } }), "Dusk"), h("div", { class: "legend__item" }, h("span", { class: "legend__swatch", style: { background: '#4a148c' } }), "Evening"))));
  }
  static get is() { return "here-day-wheel"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["here-day-wheel.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["here-day-wheel.css"]
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
          "text": "Entities with peak activity hours"
        },
        "defaultValue": "[]"
      },
      "localTime": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Date",
          "resolved": "Date",
          "references": {
            "Date": {
              "location": "global"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Current local time"
        }
      }
    };
  }
  static get states() {
    return {
      "selectedEntity": {},
      "hoveredHour": {}
    };
  }
}
//# sourceMappingURL=here-day-wheel.js.map
