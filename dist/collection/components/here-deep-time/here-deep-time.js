import { h } from '@stencil/core';
export class HereDeepTime {
  constructor() {
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
    return (h("div", { class: "timeline" }, this.eras.map((era, i) => (h("button", { key: era.yearsAgoDisplay, class: `timeline__node ${i === this.activeIndex ? 'timeline__node--active' : ''}`, style: { '--era-color': era.color }, onClick: () => { this.activeIndex = i; }, "aria-label": `Jump to ${era.yearsAgoDisplay}`, "aria-pressed": String(i === this.activeIndex) }, h("span", { class: "timeline__dot" }), h("span", { class: "timeline__label" }, era.yearsAgoDisplay))))));
  }
  renderEraContent(era) {
    return (h("div", { class: "era-content", key: era.yearsAgoDisplay, style: { '--era-color': era.color } }, h("div", { class: "era-content__header" }, h("div", { class: "era-content__badge" }, era.yearsAgoDisplay), h("h2", { class: "era-content__environment" }, era.environment)), h("div", { class: "era-content__illustration", "aria-hidden": "true" }, h("div", { class: "era-content__illustration-placeholder", style: { background: era.color } }, this.getEraEmoji(era))), h("p", { class: "era-content__narrative" }, era.narrative), era.fossils && era.fossils.length > 0 && (h("div", { class: "era-content__fossils" }, h("h4", { class: "era-content__fossils-title" }, "Fossil Record"), h("ul", { class: "fossil-list" }, era.fossils.map(f => (h("li", { key: f.name, class: "fossil-list__item" }, h("span", { class: "fossil-list__name" }, f.name), h("span", { class: "fossil-list__taxon" }, f.taxon), h("span", { class: "fossil-list__age" }, f.ageDisplay))))))), h("div", { class: "era-content__sources" }, h("span", { class: "era-content__source-label" }, "Data sources:"), h("a", { class: "era-content__source-link", href: `https://macrostrat.org/map#x=${-122.06}&y=${37.56}&z=10`, target: "_blank", rel: "noopener noreferrer" }, "Macrostrat"), era.fossils.length > 0 && (h("a", { class: "era-content__source-link", href: `https://paleobiodb.org/classic/displayCollResults?lngmin=-122.5&lngmax=-121.5&latmin=37.0&latmax=38.0`, target: "_blank", rel: "noopener noreferrer" }, "PBDB")))));
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
      return h("div", { class: "empty" }, "No deep time data available.");
    }
    const era = this.activeEra;
    return (h("div", { class: "deep-time-view" }, h("div", { class: "deep-time-layout" }, h("div", { class: "scrubber-panel" }, h("div", { class: "scrubber-label scrubber-label--top" }, "TODAY"), h("input", { type: "range", class: "scrubber", min: "0", max: String(this.eras.length - 1), step: "1", value: String(this.activeIndex), "aria-label": "Time scrubber", onInput: this.handleScrub.bind(this) }), h("div", { class: "scrubber-label scrubber-label--bottom" }, "500 Mya"), this.renderTimeline()), h("div", { class: "content-panel" }, era && this.renderEraContent(era))), h("div", { class: "era-nav" }, h("button", { class: "era-nav__btn", disabled: this.activeIndex === 0, onClick: () => {
        if (this.activeIndex > 0)
          this.activeIndex--;
      }, "aria-label": "Go to more recent era" }, "\u2191 More recent"), h("span", { class: "era-nav__divider" }, "|"), h("button", { class: "era-nav__btn", disabled: this.activeIndex === this.eras.length - 1, onClick: () => {
        if (this.activeIndex < this.eras.length - 1)
          this.activeIndex++;
      }, "aria-label": "Go to older era" }, "Older \u2193"))));
  }
  static get is() { return "here-deep-time"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["here-deep-time.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["here-deep-time.css"]
    };
  }
  static get properties() {
    return {
      "eras": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "DeepTimeEra[]",
          "resolved": "DeepTimeEra[]",
          "references": {
            "DeepTimeEra": {
              "location": "import",
              "path": "../../types"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Ordered list of eras (present \u2192 oldest)"
        },
        "defaultValue": "[]"
      }
    };
  }
  static get states() {
    return {
      "activeIndex": {}
    };
  }
}
//# sourceMappingURL=here-deep-time.js.map
