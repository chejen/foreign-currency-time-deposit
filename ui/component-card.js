import { css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import BaseElement from './base';
import { format } from './utils';
import './component-table';

/** Custom `component-card` component */
class ComponentCard extends BaseElement {
  static styles = css`
    :host {
      display: block;
      padding: 5px;
      font-size: 0.9rem;
    }
    #heading {
      display: flex;
      justify-content: space-between;
      color: var(--color-light1);
      padding: 3px 0 8px;
    }
    #content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .digits {
      font-weight: 600;
    }
    .arrow {
      display: none;
    }
    .amount {
      display: flex;
      justify-content: flex-start;
    }
    .field-name, .foreign-currency {
      padding-right: 10px;
    }
    .original-equivalent {
      color: var(--color-light1);
      margin-right: 30px;
    }
    .pl {
      display: flex;
      color: red;
      font-weight: 600;
      align-items: flex-end;
    }
    component-table {
      margin-top: 1rem;
      display: block;
    }

    @media only screen and (min-width: 481px) and (max-width: 768px) {
      .exchange-rate {
        display: none;
      }
    }
    @media only screen and (max-width: 480px) {
      :host {
        font-size: 0.8rem;
      }
      .desktop-only {
        display: none;
      }
      .arrow {
        width: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        color: var(--color-primary);
        transition: .1s;
      }
      .arrow.rotate {
        transform: rotate(90deg);
      }
      .amount {
        flex: 1;
        padding: 3px 0;
        flex-direction: column;
      }
      .foreign-currency {
        font-size: 0.9rem;
        padding: 0 0 3px;
      }
      .exchange-rate {
        font-size: 0.8rem;
      }
      .original-equivalent {
        margin-right: unset;
      }
      .pl {
        padding-bottom: 3px;
      }
      component-table {
        display: none;
      }
      component-table.show {
        display: block;
      }
    }
  `;

  static properties = {
    isTableCollapsed: {
      type: Boolean,
      attribute: false,
    },
    deposit: {
      type: Object,
      attribute: false,
    },
  };

  /**
   * Create a shadow DOM for <component-card>.
   */
  constructor() {
    super();
    this.isTableCollapsed = true;
    this.deposit = {};
  }

  /**
   * Toggle the table
   */
  arrowClickHandler() {
    this.isTableCollapsed = !this.isTableCollapsed;
  }

  /**
   * To define a template for `component-card`
   * @return {TemplateResult} template result
   */
  render() {
    const arrowClasses = {
      arrow: true,
      rotate: !this.isTableCollapsed,
    };
    const tableClasses = {
      show: !this.isTableCollapsed,
    };
    const {
      time_deposit_account: account,
      year,
      month,
      day,
      cost,
      exchange_rate: exchangeRate,
      currency,
      history,
    } = this.deposit;
    const date = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString();
    const latestHistory = history?.[history.length - 1];
    const availableBalance = latestHistory ?
      (latestHistory.time_deposit_amount +
      latestHistory.received_gross_interest_amount) :
      0;

    return html`
      <div id="heading">
        <div id="date">
          <span class="desktop-only">Deposit Date: </span>
          ${date}
        </div>
        <div id="account">
          <span class="desktop-only">Account: </span>${account}
        </div>
      </div>
      <div id="content">
        <div
          class="${classMap(arrowClasses)}"
          @click="${this.arrowClickHandler}"
        >
          &gt;
        </div>
        <div class="amount">
          <div class="field-name desktop-only">Deposit Amount:</div>
          <div class="foreign-currency">
            <span class="digits">${format(cost / exchangeRate)}</span>
            &nbsp;
            in ${currency}
            <span class="exchange-rate">
              (exchange rate: ${format(exchangeRate)})
            </span>
          </div>
          <div class="original-equivalent">
            <span class="digits">
              ${format(cost)}
            </span>
            in NTD equivalent
          </div>
        </div>
        ${latestHistory ? html`
          <div class="amount desktop-only">
            <div class="field-name desktop-only">Available Balance:</div>
            <div class="foreign-currency">
              <span class="digits">${format(availableBalance)}</span>
              &nbsp;
              in ${currency}
            </div>
            <div class="original-equivalent">
              <div>
                <span class="digits">
                  ???
                </span>
                in NTD equivalent
              </div>
            </div>
          </div>
          <div class="pl">???</div>` : null
        }
      </div>

      <component-table
        class="${classMap(tableClasses)}"
        .deposit="${this.deposit}"
      >
      </component-table>
    `;
  }
}

customElements.define('component-card', ComponentCard);
