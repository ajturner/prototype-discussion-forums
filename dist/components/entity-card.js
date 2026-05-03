import { proxyCustomElement, HTMLElement, createEvent, h } from '@stencil/core/internal/client';

const entityCardCss = ":host{display:block}.card{display:flex;align-items:flex-start;gap:12px;padding:12px;background:#ffffff;border:1px solid #e0e0e0;border-radius:10px;cursor:pointer;transition:box-shadow 0.15s ease, border-color 0.15s ease}.card:hover{box-shadow:0 4px 16px rgba(0, 0, 0, 0.12);border-color:#42a5f5}.card--selected{border-color:#1976d2;box-shadow:0 0 0 2px rgba(25, 118, 210, 0.3)}.card__photo{flex-shrink:0;width:64px;height:64px;border-radius:8px;overflow:hidden;background:#f5f5f5;display:flex;align-items:center;justify-content:center}.card__photo img{width:100%;height:100%;object-fit:cover}.card__photo .placeholder{font-size:28px;line-height:1}.card__body{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}.card__names{display:flex;flex-direction:column;gap:2px}.card__common{font-size:14px;font-weight:600;color:#1a1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.card__scientific{font-size:11px;font-style:italic;color:#607d8b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.card__status{font-size:11px;color:#4caf50;font-weight:500}.card__link{font-size:11px;color:#1976d2;text-decoration:none;margin-top:4px;display:inline-block}.card__link:hover{text-decoration:underline}.card--compact{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:20px;background:rgba(255, 255, 255, 0.9);border:1px solid rgba(0, 0, 0, 0.15);font-size:12px;font-weight:500;cursor:pointer;transition:background 0.15s ease;color:#1a1a2e}.card--compact:hover,.card--compact:focus{background:white;outline:2px solid #42a5f5;outline-offset:1px}.card__photo-mini{width:22px;height:22px;border-radius:50%;overflow:hidden;background:#e8f5e9;display:flex;align-items:center;justify-content:center;flex-shrink:0}.card__photo-mini img{width:100%;height:100%;object-fit:cover}.card__photo-mini .placeholder{font-size:13px;line-height:1}.card__name-mini{white-space:nowrap}";

const EntityCard$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.cardSelect = createEvent(this, "cardSelect", 7);
    this.handleClick = () => {
      this.cardSelect.emit(this.entity);
    };
    this.handleImgError = () => {
      this.imgError = true;
    };
    this.entity = undefined;
    this.compact = false;
    this.selected = false;
    this.imgError = false;
  }
  getPhotoPlaceholder(entity) {
    // Return an emoji placeholder based on strataLayer
    const placeholders = {
      atmosphere: '🦅',
      canopy: '🦜',
      understory: '🌿',
      ground: '🌺',
      'soil-surface': '🍄',
      'upper-soil': '🪱',
      mycorrhizal: '🕸️',
      bedrock: '🪨',
    };
    if (entity.strataLayer && placeholders[entity.strataLayer]) {
      return placeholders[entity.strataLayer];
    }
    if (entity.phenologyCategory) {
      const cat = {
        bloom: '🌸',
        migration: '🦋',
        breed: '🥚',
        fruit: '🍎',
        hibernate: '💤',
        emerge: '🌱',
      };
      return cat[entity.phenologyCategory] || '🌿';
    }
    return '🔍';
  }
  render() {
    if (!this.entity)
      return null;
    const { commonName, scientificName, status, photoUrl, iNatUrl } = this.entity;
    const placeholder = this.getPhotoPlaceholder(this.entity);
    if (this.compact) {
      return (h("button", { class: `card card--compact ${this.selected ? 'card--selected' : ''}`, onClick: this.handleClick, "aria-label": commonName }, h("span", { class: "card__photo-mini" }, photoUrl && !this.imgError ? (h("img", { src: photoUrl, alt: commonName, onError: this.handleImgError })) : (h("span", { class: "placeholder" }, placeholder))), h("span", { class: "card__name-mini" }, commonName)));
    }
    return (h("div", { class: `card ${this.selected ? 'card--selected' : ''}`, onClick: this.handleClick, role: "button", tabIndex: 0, onKeyDown: e => (e.key === 'Enter' || e.key === ' ') && this.handleClick(), "aria-label": `View details for ${commonName}` }, h("div", { class: "card__photo" }, photoUrl && !this.imgError ? (h("img", { src: photoUrl, alt: commonName, onError: this.handleImgError })) : (h("span", { class: "placeholder" }, placeholder))), h("div", { class: "card__body" }, h("div", { class: "card__names" }, h("span", { class: "card__common" }, commonName), h("span", { class: "card__scientific" }, scientificName)), status && h("div", { class: "card__status" }, status), iNatUrl && (h("a", { class: "card__link", href: iNatUrl, target: "_blank", rel: "noopener noreferrer", onClick: e => e.stopPropagation() }, "View on iNaturalist \u2192")))));
  }
  static get style() { return entityCardCss; }
}, [1, "entity-card", {
    "entity": [16],
    "compact": [4],
    "selected": [4],
    "imgError": [32]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["entity-card"];
  components.forEach(tagName => { switch (tagName) {
    case "entity-card":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, EntityCard$1);
      }
      break;
  } });
}

const EntityCard = EntityCard$1;
const defineCustomElement = defineCustomElement$1;

export { EntityCard, defineCustomElement };

//# sourceMappingURL=entity-card.js.map