import { h } from '@stencil/core';
export class EntityCard {
  constructor() {
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
  static get is() { return "entity-card"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["entity-card.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["entity-card.css"]
    };
  }
  static get properties() {
    return {
      "entity": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Entity",
          "resolved": "Entity",
          "references": {
            "Entity": {
              "location": "import",
              "path": "../../types"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "The organism entity to display"
        }
      },
      "compact": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Whether to show the card in a compact (inline) format"
        },
        "attribute": "compact",
        "reflect": false,
        "defaultValue": "false"
      },
      "selected": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Whether the card is currently selected/expanded"
        },
        "attribute": "selected",
        "reflect": false,
        "defaultValue": "false"
      }
    };
  }
  static get states() {
    return {
      "imgError": {}
    };
  }
  static get events() {
    return [{
        "method": "cardSelect",
        "name": "cardSelect",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Emitted when the card is clicked"
        },
        "complexType": {
          "original": "Entity",
          "resolved": "Entity",
          "references": {
            "Entity": {
              "location": "import",
              "path": "../../types"
            }
          }
        }
      }];
  }
}
//# sourceMappingURL=entity-card.js.map
