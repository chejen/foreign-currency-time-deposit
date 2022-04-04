import { css, html } from 'lit';
import BaseElement from './base';

const NUM_OF_SLIDES = 3;

/** Custom `deposit-overview` component */
class DepositOverview extends BaseElement {
  static styles = css`
    :host {
      --indicator-height: 20px;
      width: 100%;
    }
    #indicator {
      display: none;
    }
    #slides {
      display: flex;
      flex-wrap: wrap;
      overflow-y: hidden;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
    }
    .flex-item {
      width: 33.33%;
      display: flex;
    }
    .flex-content {
      flex: 1;
      margin: 5px;
      padding: 8px;
      overflow: auto;
      background-color: var(--color-darkblue);
      color: white;
      border-radius: 3px;
    }
    @media only screen and (min-width: 769px) and (max-width: 1024px) {
      .flex-item {
        width: 50%;
      }
    }
    @media only screen and (min-width: 481px) and (max-width: 768px) {
      .flex-item {
        width: 100%;
      }
    }
    @media only screen and (max-width: 480px) {
      :host {
        max-height: 25%;
      }
      #slides {
        height: calc(100% - var(--indicator-height));
        flex-wrap: nowrap;
      }
      .flex-item {
        width: 100%;
        flex-shrink: 0;
      }
      .flex-content {
        border-radius: unset;
        margin: unset;
        scroll-snap-align: start;
      }
      #indicator {
        height: var(--indicator-height);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #indicator > div {
        margin: 0 5px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        border: 1px solid var(--color-primary);
      }
      #indicator > div.active {
        background-color: var(--color-primary);
      }
    }
  `;

  static properties = {
    slide: {
      type: Number,
      attribute: false,
    },
  };

  /**
   * Create a shadow DOM for <deposit-overview>.
   */
  constructor() {
    super();
    this.slide = 0;
  }

  /**
   * Detect which position the carousel is at
   * by leveraging #slides' scroll event.
   * @param {object} event - scroll event
   */
  scrollHandler(event) {
    clearTimeout(this._scrollTimer);
    this._scrollEventTarget = event.target;
    // debounce
    this._scrollTimer = setTimeout(() => {
      const breakpoint = this._scrollEventTarget.scrollWidth / NUM_OF_SLIDES;
      const num = this._scrollEventTarget.scrollLeft / breakpoint;
      this.slide = parseInt(num, 10);
      this._scrollEventTarget = undefined;
      clearTimeout(this.scrollTimer);
    }, 50);
  }

  /**
   * To define a template for `deposit-overview`
   * @return {TemplateResult} template result
   */
  render() {
    return html`
      <div id="slides" @scroll="${this.scrollHandler}">
        <div class="flex-item">
          <div class="flex-content">
            <div>Available Balance</div>
            <div>10,000 in USD, 290,000 in NTD (-12,500)</div>
            <div>10,000 in USD, 290,000 in NTD (-12,500)</div>
            <div>10,000 in USD, 290,000 in NTD (-12,500)</div>
            <div>10,000 in USD, 290,000 in NTD (-12,500)</div>
            <div>123456 (-34,567)</div>
            <div>total in NTD equlavent</div>
          </div>
        </div>
        <div class="flex-item"><div class="flex-content">02</div></div>
        <div class="flex-item"><div class="flex-content">03</div></div>
      </div>
      <div id="indicator">
        ${[...Array(NUM_OF_SLIDES).keys()].map((el) => (html`
          <div class="${el === this.slide ? 'active' : ''}"></div>
        `))}
      </div>
    `;
  }
}

customElements.define('deposit-overview', DepositOverview);
