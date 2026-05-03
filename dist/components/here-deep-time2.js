import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const hereDeepTimeCss = ":host{display:block;width:100%;height:100%}.empty{padding:24px;text-align:center;color:#9e9e9e}.deep-time-view{display:flex;flex-direction:column;height:100%;color:#e0f2fe}.deep-time-layout{display:flex;flex:1;gap:0;overflow:hidden}.scrubber-panel{display:flex;flex-direction:column;align-items:center;width:68px;flex-shrink:0;background:#0d1f2d;border-right:1px solid #1e3a52;padding:8px 6px;gap:6px;overflow-y:auto}.scrubber-label{font-size:9px;color:#78909c;text-align:center;text-transform:uppercase;letter-spacing:0.04em;font-family:monospace;line-height:1.2}.scrubber-label--top{color:#4fc3f7}.scrubber-label--bottom{color:#9c27b0}.scrubber{appearance:slider-vertical;writing-mode:vertical-lr;direction:rtl;width:8px;height:160px;cursor:pointer;accent-color:#4fc3f7;flex-shrink:0}.scrubber::-webkit-slider-thumb{appearance:none;width:18px;height:18px;border-radius:50%;background:#4fc3f7;border:2px solid #0d1f2d;cursor:pointer}.timeline{display:flex;flex-direction:column;gap:0;width:100%}.timeline__node{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 2px;background:none;border:none;cursor:pointer;font-family:inherit;border-left:2px solid transparent;transition:border-color 0.15s ease}.timeline__node:hover{background:rgba(255, 255, 255, 0.05)}.timeline__node--active{border-left-color:var(--era-color, #4fc3f7);background:rgba(255, 255, 255, 0.06)}.timeline__node--active .timeline__dot{background:var(--era-color, #4fc3f7);transform:scale(1.3)}.timeline__dot{width:8px;height:8px;border-radius:50%;background:#37474f;transition:background 0.15s ease, transform 0.15s ease;flex-shrink:0}.timeline__label{font-size:8px;color:#546e7a;text-align:center;line-height:1.2;font-family:monospace}.timeline__node--active .timeline__label{color:var(--era-color, #4fc3f7);font-weight:700}.content-panel{flex:1;overflow-y:auto;padding:16px}.era-content{display:flex;flex-direction:column;gap:14px;animation:slideIn 0.25s ease}.era-content__header{display:flex;flex-direction:column;gap:4px}.era-content__badge{display:inline-block;padding:3px 10px;border-radius:12px;background:var(--era-color, #4fc3f7);color:#000000;font-size:11px;font-weight:700;letter-spacing:0.04em;align-self:flex-start}.era-content__environment{margin:0;font-size:16px;font-weight:700;color:#ffffff;line-height:1.3}.era-content__illustration{width:100%;border-radius:10px;overflow:hidden}.era-content__illustration-placeholder{width:100%;height:100px;display:flex;align-items:center;justify-content:center;font-size:52px;opacity:0.7;border-radius:10px}.era-content__narrative{font-size:13px;line-height:1.7;color:#b0bec5;margin:0}.era-content__fossils{background:rgba(255, 255, 255, 0.04);border:1px solid rgba(255, 255, 255, 0.08);border-radius:8px;padding:10px 12px}.era-content__fossils-title{font-size:11px;font-weight:700;color:#78909c;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px}.era-content__sources{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.era-content__source-label{font-size:10px;color:#546e7a}.era-content__source-link{font-size:10px;color:#4fc3f7;text-decoration:none}.era-content__source-link:hover{text-decoration:underline}.fossil-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.fossil-list__item{display:flex;flex-direction:column;gap:1px}.fossil-list__name{font-size:12px;font-weight:600;color:#cfd8dc}.fossil-list__taxon{font-size:10px;font-style:italic;color:#607d8b}.fossil-list__age{font-size:10px;color:#546e7a;font-family:monospace}.era-nav{display:flex;align-items:center;justify-content:center;gap:16px;padding:10px;background:#0d1f2d;border-top:1px solid #1e3a52}.era-nav__btn{background:none;border:1px solid #1e3a52;color:#78909c;font-size:12px;padding:6px 14px;border-radius:6px;cursor:pointer;font-family:inherit;transition:color 0.12s ease, border-color 0.12s ease}.era-nav__btn:hover:not(:disabled){color:#4fc3f7;border-color:#4fc3f7}.era-nav__btn:disabled{opacity:0.3;cursor:not-allowed}.era-nav__divider{color:#1e3a52;font-size:14px}@keyframes slideIn{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}";

const HereDeepTime = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
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
  static get style() { return hereDeepTimeCss; }
}, [1, "here-deep-time", {
    "eras": [16],
    "activeIndex": [32]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["here-deep-time"];
  components.forEach(tagName => { switch (tagName) {
    case "here-deep-time":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, HereDeepTime);
      }
      break;
  } });
}

export { HereDeepTime as H, defineCustomElement as d };

//# sourceMappingURL=here-deep-time2.js.map