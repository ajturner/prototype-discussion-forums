import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';

const hereModeSwitcherCss = ":host{display:block;width:100%}.mode-switcher{display:flex;width:100%;background:#0d1f2d;border-bottom:1px solid #1e3a52}.mode-btn{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:10px 4px;background:none;border:none;border-bottom:3px solid transparent;color:#78909c;cursor:pointer;transition:color 0.15s ease, border-color 0.15s ease, background 0.15s ease;font-family:inherit;font-size:12px;line-height:1}.mode-btn:hover{color:#b0bec5;background:rgba(255, 255, 255, 0.05)}.mode-btn:focus-visible{outline:2px solid #42a5f5;outline-offset:-2px}.mode-btn--active{color:#4fc3f7;border-bottom-color:#4fc3f7}.mode-btn__icon{font-size:18px;line-height:1}.mode-btn__label{font-size:11px;font-weight:500;letter-spacing:0.02em;text-transform:uppercase}";

const MODES = [
  { key: 'strata', icon: '≡', label: 'Strata', ariaLabel: 'View by vertical strata layers' },
  { key: 'day', icon: '☉', label: 'Day', ariaLabel: 'View time-of-day activity' },
  { key: 'phenology', icon: '⟳', label: 'Season', ariaLabel: 'View seasonal phenology calendar' },
  { key: 'deep-time', icon: '⏳', label: 'Deep Time', ariaLabel: 'Explore geological deep time' },
];
const HereModeSwitcher = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.modeChange = createEvent(this, "modeChange", 7);
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
  static get style() { return hereModeSwitcherCss; }
}, [1, "here-mode-switcher", {
    "activeMode": [1, "active-mode"]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["here-mode-switcher"];
  components.forEach(tagName => { switch (tagName) {
    case "here-mode-switcher":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, HereModeSwitcher);
      }
      break;
  } });
}

export { HereModeSwitcher as H, defineCustomElement as d };

//# sourceMappingURL=here-mode-switcher2.js.map