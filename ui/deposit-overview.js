import { css, html } from 'lit';
import BaseElement from './base';
import { format } from './utils';
import './component-slide';

/** Custom `deposit-overview` component */
class DepositOverview extends BaseElement {
  static styles = css`
    :host {
      --indicator-height: 20px;
      width: 100%;
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
      attribute: false,
    },
    exchangeRates: {
      type: Array,
      attribute: false,
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
    this.deposits = [];
    this.exchangeRates = {};
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
    const costs = {};
    const currentValues = {};
    let totalCosts = 0;
    let totalCurrentValues = 0;
    this.deposits.forEach(({ currency, cost, history }) => {
      const latestHistory = history?.[history?.length - 1];
      costs[currency] = (costs[currency] || 0) + cost;
      totalCosts += cost;
      if (latestHistory) {
        const amount = latestHistory.time_deposit_amount +
          latestHistory.received_gross_interest_amount;
        currentValues[currency] = (currentValues[currency] || 0) + amount;
      }
    });
    Object.keys(currentValues).forEach((key) => {
      currentValues[key] *= this.exchangeRates[key];
      totalCurrentValues += currentValues[key];
    });

    return html`
      <div id="slides" @scroll="${this.scrollHandler}">
        <div class="flex-item">
          <component-slide
            title="Total ROI"
            subtitle="in NTD Equivalent"
            bottomline="${format(totalCurrentValues, 1)}"
            pl="
            ${format(totalCurrentValues - totalCosts, 1)},
            ${format((totalCurrentValues - totalCosts) / totalCosts * 100, 1)}%
            "
            ?isprofit="${totalCurrentValues - totalCosts > 0}"
          >
            <ul>
            ${Object.keys(currentValues)
              .sort().map((key) => {
                const pl = currentValues[key] - costs[key];
                return html`<li>(${key}) ${format(currentValues[key], 1)}
                  <span class="${pl > 0 ? 'profit' : 'loss'}">
                    <b>${format(pl, 1)}</b>
                    (${format(pl / costs[key] * 100, 1)}%)
                  </span>
                </li>`;
              })
            }
            </ul>
          </component-slide>
        </div>

        <div class="flex-item">
          <component-slide
            title="Cost"
            bottomline="${format(totalCosts)}"
            subtitle="in NTD Equivalent"
          >
            <ul>
            ${Object.keys(costs)
              .sort().map((key) =>
                html`<li>(${key}) ${format(costs[key])}</li>`,
            )}
            </ul>
          </component-slide>
        </div>

        <div class="flex-item">
          <component-slide
            title="Exchange Rates"
            subtitle="${this.exchangeRates.time}"
          >
            <ul>
            ${Object.keys(this.exchangeRates)
              .filter((key) => key !== 'time').sort().map((key) =>
                html`<li>(${key}) ${this.exchangeRates[key]}</li>`,
            )}
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
