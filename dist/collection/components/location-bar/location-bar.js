import { h } from '@stencil/core';
export class LocationBar {
  constructor() {
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
  static get is() { return "location-bar"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["location-bar.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["location-bar.css"]
    };
  }
  static get properties() {
    return {
      "context": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "LocationContext",
          "resolved": "LocationContext",
          "references": {
            "LocationContext": {
              "location": "import",
              "path": "../../types"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Full location context including weather and time"
        }
      }
    };
  }
}
//# sourceMappingURL=location-bar.js.map
