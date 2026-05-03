import { h } from '@stencil/core';
const MODES = [
  { key: 'strata', icon: '≡', label: 'Strata', ariaLabel: 'View by vertical strata layers' },
  { key: 'day', icon: '☉', label: 'Day', ariaLabel: 'View time-of-day activity' },
  { key: 'phenology', icon: '⟳', label: 'Season', ariaLabel: 'View seasonal phenology calendar' },
  { key: 'deep-time', icon: '⏳', label: 'Deep Time', ariaLabel: 'Explore geological deep time' },
];
export class HereModeSwitcher {
  constructor() {
    this.activeMode = 'strata';
  }
  handleModeClick(mode) {
    if (mode !== this.activeMode) {
      this.modeChange.emit(mode);
    }
  }
  render() {
    return (h("nav", { class: "mode-switcher", role: "tablist", "aria-label": "Exploration modes" }, MODES.map(m => (h("button", { key: m.key, role: "tab", class: `mode-btn ${this.activeMode === m.key ? 'mode-btn--active' : ''}`, "aria-selected": String(this.activeMode === m.key), "aria-label": m.ariaLabel, onClick: () => this.handleModeClick(m.key) }, h("span", { class: "mode-btn__icon", "aria-hidden": "true" }, m.icon), h("span", { class: "mode-btn__label" }, m.label))))));
  }
  static get is() { return "here-mode-switcher"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["here-mode-switcher.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["here-mode-switcher.css"]
    };
  }
  static get properties() {
    return {
      "activeMode": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "ExploreMode",
          "resolved": "\"day\" | \"deep-time\" | \"phenology\" | \"strata\"",
          "references": {
            "ExploreMode": {
              "location": "import",
              "path": "../../types"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Currently active mode"
        },
        "attribute": "active-mode",
        "reflect": false,
        "defaultValue": "'strata'"
      }
    };
  }
  static get events() {
    return [{
        "method": "modeChange",
        "name": "modeChange",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Fired when user selects a different mode"
        },
        "complexType": {
          "original": "ExploreMode",
          "resolved": "\"day\" | \"deep-time\" | \"phenology\" | \"strata\"",
          "references": {
            "ExploreMode": {
              "location": "import",
              "path": "../../types"
            }
          }
        }
      }];
  }
}
//# sourceMappingURL=here-mode-switcher.js.map
