import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const hereStrataCss = ":host{display:block;width:100%;height:100%}.empty{padding:24px;color:#9e9e9e;text-align:center}.strata-view{display:flex;flex-direction:column;height:100%}.strata-layout{display:flex;flex:1;overflow:hidden}.ruler{display:flex;flex-direction:column;width:60px;flex-shrink:0;background:#1a2a3a;padding:0 4px;overflow:hidden}.ruler__mark{display:flex;align-items:center;justify-content:flex-end;border-bottom:1px solid rgba(255, 255, 255, 0.1);padding-right:6px;min-height:40px}.ruler__label{font-size:9px;color:#78909c;text-align:right;line-height:1.2;font-family:monospace}.strata-column{flex:1;overflow-y:auto;overflow-x:hidden}.layer{width:100%;transition:flex 0.3s ease}.layer__header{width:100%;display:flex;align-items:center;gap:8px;padding:12px 14px;border:none;cursor:pointer;font-family:inherit;text-align:left;transition:filter 0.15s ease;background:inherit;color:inherit}.layer__header:hover{filter:brightness(1.08)}.layer__header:focus-visible{outline:2px solid rgba(255, 255, 255, 0.6);outline-offset:-2px}.layer__label{font-size:13px;font-weight:600;flex-shrink:0;min-width:140px}.layer__entities-preview{display:flex;flex-wrap:wrap;gap:4px;flex:1;overflow:hidden;max-height:24px}.layer__entity-chip{font-size:11px;padding:1px 7px;border-radius:10px;background:rgba(255, 255, 255, 0.2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px}.layer__entity-more{font-size:11px;padding:1px 7px;border-radius:10px;background:rgba(255, 255, 255, 0.1);white-space:nowrap}.layer__toggle{font-size:11px;flex-shrink:0;margin-left:auto;opacity:0.7}.layer__body{padding:12px 14px 16px;background:rgba(0, 0, 0, 0.15);animation:slideDown 0.2s ease}.layer__description{font-size:12px;line-height:1.5;opacity:0.85;margin:0 0 12px}.layer__entity-list{display:flex;flex-direction:column;gap:4px}.layer--expanded .layer__header{border-bottom:1px solid rgba(255, 255, 255, 0.15)}.entity-btn{display:flex;flex-direction:column;padding:8px 10px;background:rgba(255, 255, 255, 0.12);border:1px solid rgba(255, 255, 255, 0.15);border-radius:6px;cursor:pointer;font-family:inherit;text-align:left;transition:background 0.15s ease;color:inherit}.entity-btn:hover{background:rgba(255, 255, 255, 0.2)}.entity-btn--selected{background:rgba(255, 255, 255, 0.25);border-color:rgba(255, 255, 255, 0.5)}.entity-btn__name{font-size:13px;font-weight:500}.entity-btn__sci{font-size:11px;font-style:italic;opacity:0.7;margin-top:1px}.entity-panel{margin-top:12px;padding:12px;background:rgba(0, 0, 0, 0.25);border-radius:8px;border:1px solid rgba(255, 255, 255, 0.15);animation:fadeIn 0.2s ease}.entity-panel__header{display:flex;align-items:baseline;gap:8px;margin-bottom:8px}.entity-panel__name{font-size:14px;font-weight:700;margin:0;flex:1}.entity-panel__sci{font-size:11px;font-style:italic;opacity:0.7}.entity-panel__close{background:none;border:none;color:inherit;cursor:pointer;font-size:14px;opacity:0.6;padding:2px 4px;border-radius:4px;font-family:inherit;flex-shrink:0}.entity-panel__close:hover{opacity:1}.entity-panel__status{font-size:12px;color:#a5d6a7;margin:4px 0}.entity-panel__meta{font-size:11px;opacity:0.8;margin:4px 0}.entity-panel__link{display:inline-block;margin-top:8px;font-size:11px;color:#90caf9;text-decoration:none}.entity-panel__link:hover{text-decoration:underline}.strata-legend{padding:12px 16px;background:#0d1f2d;border-top:1px solid #1e3a52}.strata-legend__title{font-size:12px;font-weight:600;color:#78909c;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.05em}.strata-legend__desc{font-size:11px;color:#546e7a;margin:0;line-height:1.4}@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}";

const HereStrata = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
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
    return (h("div", { class: "ruler", "aria-hidden": "true" }, layers.map((layer, i) => (h("div", { key: layer.key, class: "ruler__mark", style: { flex: String(i < 4 ? 1 : 1.2) } }, h("span", { class: "ruler__label" }, layer.depthLabel))))));
  }
  renderEntityPanel(entity) {
    return (h("div", { class: "entity-panel", role: "region", "aria-label": entity.commonName }, h("div", { class: "entity-panel__header" }, h("h3", { class: "entity-panel__name" }, entity.commonName), h("span", { class: "entity-panel__sci" }, entity.scientificName), h("button", { class: "entity-panel__close", onClick: () => { this.selectedEntity = null; }, "aria-label": "Close entity details" }, "\u2715")), entity.status && (h("p", { class: "entity-panel__status" }, entity.status)), entity.dayPeakHour !== undefined && (h("p", { class: "entity-panel__meta" }, "\u23F0 Peak activity: ", entity.dayPeakHour, ":00", entity.dayDurationHours ? ` (±${Math.round(entity.dayDurationHours / 2)}h)` : '')), entity.phenologyCategory && (h("p", { class: "entity-panel__meta" }, "\uD83D\uDDD3\uFE0F Phenology: ", entity.phenologyCategory, entity.phenologyPeakWeek ? ` · peak week ${entity.phenologyPeakWeek}` : '')), entity.iNatUrl && (h("a", { class: "entity-panel__link", href: entity.iNatUrl, target: "_blank", rel: "noopener noreferrer" }, "View on iNaturalist \u2192"))));
  }
  render() {
    if (!this.layers || this.layers.length === 0) {
      return h("div", { class: "empty" }, "No strata data available.");
    }
    return (h("div", { class: "strata-view" }, h("div", { class: "strata-layout" }, this.renderDepthRuler(this.layers), h("div", { class: "strata-column", role: "list" }, this.layers.map(layer => {
      const isExpanded = this.expandedLayer === layer.key;
      return (h("div", { key: layer.key, class: `layer ${isExpanded ? 'layer--expanded' : ''}`, style: { background: layer.color, color: layer.textColor }, role: "listitem" }, h("button", { class: "layer__header", style: { background: layer.color, color: layer.textColor }, onClick: () => this.toggleLayer(layer.key), "aria-expanded": String(isExpanded), "aria-controls": `layer-body-${layer.key}` }, h("span", { class: "layer__label" }, layer.label), h("div", { class: "layer__entities-preview" }, layer.entities.slice(0, 5).map(e => (h("span", { key: e.id, class: "layer__entity-chip" }, e.commonName))), layer.entities.length > 5 && (h("span", { class: "layer__entity-more" }, "+", layer.entities.length - 5))), h("span", { class: "layer__toggle", "aria-hidden": "true" }, isExpanded ? '▲' : '▼')), isExpanded && (h("div", { class: "layer__body", id: `layer-body-${layer.key}` }, h("p", { class: "layer__description" }, layer.description), h("div", { class: "layer__entity-list" }, layer.entities.map(entity => {
        var _a;
        return (h("button", { key: entity.id, class: `entity-btn ${((_a = this.selectedEntity) === null || _a === void 0 ? void 0 : _a.id) === entity.id ? 'entity-btn--selected' : ''}`, onClick: () => this.selectEntity(entity) }, h("span", { class: "entity-btn__name" }, entity.commonName), h("span", { class: "entity-btn__sci" }, entity.scientificName)));
      })), this.selectedEntity && layer.entities.find(e => e.id === this.selectedEntity.id) && (this.renderEntityPanel(this.selectedEntity))))));
    }))), h("div", { class: "strata-legend" }, h("h4", { class: "strata-legend__title" }, "Ecological Strata"), h("p", { class: "strata-legend__desc" }, "Tap any layer to reveal the organisms living in that zone \u2014 from clouds to bedrock."))));
  }
  static get style() { return hereStrataCss; }
}, [1, "here-strata", {
    "layers": [16],
    "expandedLayer": [32],
    "selectedEntity": [32]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["here-strata"];
  components.forEach(tagName => { switch (tagName) {
    case "here-strata":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, HereStrata);
      }
      break;
  } });
}

export { HereStrata as H, defineCustomElement as d };

//# sourceMappingURL=here-strata2.js.map