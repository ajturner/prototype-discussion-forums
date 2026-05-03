import { h } from '@stencil/core';
export class HereStrata {
  constructor() {
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
  static get is() { return "here-strata"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["here-strata.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["here-strata.css"]
    };
  }
  static get properties() {
    return {
      "layers": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "StrataLayer[]",
          "resolved": "StrataLayer[]",
          "references": {
            "StrataLayer": {
              "location": "import",
              "path": "../../types"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Ordered list of strata layers (sky \u2192 bedrock)"
        },
        "defaultValue": "[]"
      }
    };
  }
  static get states() {
    return {
      "expandedLayer": {},
      "selectedEntity": {}
    };
  }
}
//# sourceMappingURL=here-strata.js.map
