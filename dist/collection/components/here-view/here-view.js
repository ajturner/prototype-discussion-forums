import { h } from '@stencil/core';
import { MOCK_LOCATION, MOCK_STRATA_LAYERS, MOCK_DAY_ENTITIES, MOCK_PHENOLOGY_ENTITIES, MOCK_DEEP_TIME_ERAS, } from '../../mock-data';
export class HereView {
  constructor() {
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
        return (h("here-strata", { layers: MOCK_STRATA_LAYERS }));
      case 'day':
        return (h("here-day-wheel", { entities: MOCK_DAY_ENTITIES, localTime: (_a = this.locationContext) === null || _a === void 0 ? void 0 : _a.localTime }));
      case 'phenology':
        return (h("here-phenology-wheel", { entities: MOCK_PHENOLOGY_ENTITIES, currentWeek: ((_b = this.locationContext) === null || _b === void 0 ? void 0 : _b.weekOfYear) || 1 }));
      case 'deep-time':
        return (h("here-deep-time", { eras: MOCK_DEEP_TIME_ERAS }));
      default:
        return null;
    }
  }
  render() {
    if (this.loading) {
      return (h("div", { class: "loading" }, h("div", { class: "loading__spinner", "aria-label": "Loading\u2026" }), h("p", null, "Finding your place in the world\u2026")));
    }
    return (h("div", { class: "here-shell" }, h("location-bar", { context: this.locationContext }), h("here-mode-switcher", { activeMode: this.activeMode, onModeChange: this.handleModeChange.bind(this) }), h("main", { class: `mode-panel mode-panel--${this.activeMode}`, "aria-live": "polite" }, this.renderModePanel())));
  }
  static get is() { return "here-view"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["here-view.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["here-view.css"]
    };
  }
  static get states() {
    return {
      "activeMode": {},
      "locationContext": {},
      "loading": {}
    };
  }
}
//# sourceMappingURL=here-view.js.map
