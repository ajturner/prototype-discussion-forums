import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const locationBarCss = ":host{display:block;width:100%}.location-bar{display:flex;flex-direction:column;gap:4px;padding:10px 16px;background:#1a2a3a;color:#e0f2fe;font-size:13px;line-height:1.4}.place{display:flex;align-items:center;gap:4px;font-size:15px;font-weight:600}.place .name{color:#ffffff}.place .subname{color:#90caf9;font-weight:400}.meta{display:flex;flex-wrap:wrap;gap:12px;align-items:center;color:#b0bec5;font-size:12px}.weather-item,.meta-item{display:flex;align-items:center;gap:4px}.weather-item .desc,.meta-item .desc{color:#90a4ae}.coords{margin-left:auto;font-size:11px;color:#607d8b;font-family:monospace}";

const LocationBar = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
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
    return (h("div", { class: "location-bar" }, h("div", { class: "place" }, h("span", { class: "pin", "aria-hidden": "true" }, "\uD83D\uDCCD"), h("span", { class: "name" }, location.name), location.placeName && (h("span", { class: "subname" }, "\u00A0\u00B7\u00A0", location.placeName))), h("div", { class: "meta" }, weather && (h("span", { class: "weather-item" }, h("span", { "aria-hidden": "true" }, weather.icon), h("span", null, weather.tempC, "\u00B0C"), h("span", { class: "desc" }, weather.description))), h("span", { class: "meta-item" }, h("span", { "aria-hidden": "true" }, "\uD83D\uDD50"), h("span", null, timeStr)), h("span", { class: "meta-item" }, h("span", { "aria-hidden": "true" }, "\uD83D\uDCC5"), h("span", null, "Week ", weekOfYear)), h("span", { class: "coords" }, location.lat.toFixed(4), "\u00B0N, ", Math.abs(location.lng).toFixed(4), "\u00B0W"))));
  }
  static get style() { return locationBarCss; }
}, [1, "location-bar", {
    "context": [16]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["location-bar"];
  components.forEach(tagName => { switch (tagName) {
    case "location-bar":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, LocationBar);
      }
      break;
  } });
}

export { LocationBar as L, defineCustomElement as d };

//# sourceMappingURL=location-bar2.js.map