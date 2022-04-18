import { css, html } from 'lit';
import BaseElement from './base';
import { format } from './utils';
import { signOutWithAuth } from './actions';
import './component-slide';

/** Custom `deposit-overview` component */
class DepositOverview extends BaseElement {
  static styles = css`
    :host {
      --indicator-height: 20px;
      width: 100%;
      position: relative;
    }
    ul {
      margin: 15px 0;
      padding: 0;
    }
    li {
      list-style-type: none;
      line-height: 1.1rem;
      font-size: 0.9rem;
    }
    li span {
      font-size: 0.8rem;
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
    component-slide {
      flex: 1;
      margin: 5px;
      padding: 8px;
      overflow: auto;
      background-color: var(--color-dark);
      color: white;
      border-radius: 3px;
    }
    .sign-out {
      cursor: pointer;
      position: absolute;
      color: var(--color-primary);
      left: 10px;
      top: 8px;
      font-size: 0.9rem;
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
      .sign-out {
        left: 5px;
        top: 5px;
      }
      #slides {
        height: calc(100% - var(--indicator-height));
        flex-wrap: nowrap;
      }
      .flex-item {
        width: 100%;
        flex-shrink: 0;
      }
      component-slide {
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
        border: 1px solid var(--color-darkblue);
      }
      #indicator > div.active {
        background-color: var(--color-darkblue);
      }
    }
  `;

  static properties = {
    deposits: {
      type: Array,
    },
    exchangeRates: {
      type: Array,
    },
    slideCount: {
      type: Number,
      attribute: false,
    },
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
    this.slideCount = 0;
    this.slide = 0;
  }

  /**
   * Update `slideCount` when the components are rendered.
   */
  firstUpdated() {
    this.slideCount =
      this.shadowRoot.querySelectorAll('component-slide').length;
  }

  /**
   * Detect which position the carousel is at
   * by leveraging #slides' scroll event.
   * @param {Event} event - scroll event
   */
  scrollHandler(event) {
    if (!this.slideCount) return;
    clearTimeout(this._scrollTimer);
    this._scrollEventTarget = event.target;
    // debounce
    this._scrollTimer = setTimeout(() => {
      const breakpoint = this._scrollEventTarget.scrollWidth / this.slideCount;
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
    const isExchangeRatesAvailable =
      Object.keys(this.exchangeRates || {}).length;
    const costs = {};
    const revenues = {};
    let totalCosts = 0;
    let totalRevenues = 0;
    this.deposits?.forEach(({ currency, cost, revenue }) => {
      costs[currency] = (costs[currency] || 0) + cost;
      revenues[currency] = (revenues[currency] || 0) + revenue;
      totalCosts += cost;
      totalRevenues += revenue;
    });
    const pl = this.deposits?.length && isExchangeRatesAvailable ?
      format(totalRevenues - totalCosts, 1) + ', ' +
      format((totalRevenues - totalCosts) / totalCosts * 100, 1) + '%' :
      '';

    return html`
      ${process.env.auth === 'email' ? html`
        <div class="sign-out" @click=${signOutWithAuth}>
          <u>Sign out</u>
        </div>` : null
      }
      <div id="slides" @scroll="${this.scrollHandler}">
        <div class="flex-item">
          <component-slide
            title="Total ROI"
            subtitle="in NTD Equivalent"
            bottomline="${isExchangeRatesAvailable ?
              format(totalRevenues, 1) :
              ''
            }"
            pl="${pl}"
            ?isprofit="${totalRevenues - totalCosts > 0}"
            ?isloading="${!this.exchangeRates || !this.deposits}"
          >
            <ul>
            ${isExchangeRatesAvailable && this.deposits ?
              Object.keys(revenues).sort().map((key) => {
                const pl = revenues[key] - costs[key];
                return html`<li>(${key}) ${format(revenues[key], 1)}
                  <span class="${pl > 0 ? 'profit' : 'loss'}">
                    <b>${format(pl, 1)}</b>
                    (${format(pl / costs[key] * 100, 1)}%)
                  </span>
                </li>`;
              }) :
              null
            }
            </ul>
          </component-slide>
        </div>

        <div class="flex-item">
          <component-slide
            title="Cost"
            bottomline="${format(totalCosts)}"
            subtitle="in NTD Equivalent"
            ?isloading="${!this.deposits}"
          >
            <ul>
            ${this.deposits ? Object.keys(costs)
              .sort().map((key) =>
                html`<li>(${key}) ${format(costs[key])}</li>`,
            ) : null}
            </ul>
          </component-slide>
        </div>

        <div class="flex-item">
          <component-slide
            title="Exchange Rates"
            subtitle="${this.exchangeRates?.time}"
            ?isloading="${!this.exchangeRates}"
          >
            <ul>
              ${this.exchangeRates ? Object.keys(this.exchangeRates)
                .filter((key) => key !== 'time').sort().map((key) =>
                  html`<li>(${key}) ${this.exchangeRates[key]}</li>`,
              ) : null}
            </ul>
          </component-slide>
        </div>
      </div>
      <div id="indicator">
        ${[...Array(this.slideCount).keys()].map((el) => (html`
          <div class="${el === this.slide ? 'active' : ''}"></div>
        `))}
      </div>
    `;
  }
}

customElements.define('deposit-overview', DepositOverview);
