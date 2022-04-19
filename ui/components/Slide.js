import { css, html } from 'lit';
import BaseElement from './BaseElement';

/** Custom `component-slide` component */
class Slide extends BaseElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
    }
    .title {
      font-size: 1.25rem;
      font-weight: 600;
      text-align: center;
      color: wheat;
    }
    .sub-title {
      font-size: 0.75rem;
      font-weight: 400;
      color: var(--color-light1);
    }
    .bottom-line {
      font-size: 1.5rem;
      font-weight: 600;
    }
    .profit, .loss {
      font-size: 1rem;
      font-weight: 600;
    }
  `;

  static properties = {
    title: {
      type: String,
    },
    subtitle: {
      type: String,
    },
    bottomline: {
      type: String,
    },
    pl: {
      type: String,
    },
    isProfit: {
      type: Boolean,
      attribute: 'isprofit',
    },
    isLoading: {
      type: Boolean,
      attribute: 'isloading',
    },
  };

  /**
   * Create a shadow DOM for <component-slide>.
   */
  constructor() {
    super();
    this.title = '';
    this.subtitle = '';
    this.bottomline = '';
    this.pl = '';
    this.isProfit = false;
    this.isloading = false;
  }

  /**
   * To define a template for `component-slide`
   * @return {TemplateResult} template result
   */
  render() {
    return html`
      <div class="title">
        ${this.title}
        ${this.subtitle ?
          html`<div class="sub-title">${this.subtitle}</div>` :
          null
        }
      </div>
      ${this.isLoading ?
        html`<img src="./images/loading.gif" width="64" height="64" />` :
        html`
          <slot></slot>
          <div class="bottom-line">
            ${this.bottomline}
            ${this.pl ?
              html`<span class="${this.isProfit ? 'profit' : 'loss'}">
                  (${this.pl})
                </span>
              ` :
              null
            }
          </div>
        `
      }
    `;
  }
}

customElements.define('component-slide', Slide);
