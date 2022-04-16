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
      padding: 0 0 5px;
    }
    .currency {
      color: var(--color-primary);
      margin-left: -3px;
      padding: 3px;
      border-radius: 2px;
      border: 1px solid var(--color-primary);
      font-size: 0.7rem;
    }
    #content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .arrow {
      display: none;
    }
    .details {
      flex: 1;
      color: var(--color-light1);
    }
    .field-name {
      color: var(--color-dark);
    }
    .field-value {
      color: var(--color-dark);
      font-weight: 600;
    }
    .sub {
      font-size: 0.7rem;
    }
    .amount {
      padding-top: 5px;
      display: flex;
      justify-content: space-between;
    }
    .pl {
      display: flex;
      font-weight: 600;
      align-items: flex-end;
    }
    component-table {
      margin-top: 10px;
      display: block;
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
      revenue,
      pl,
      exchange_rate: exchangeRate,
      currency,
      history,
    } = this.deposit;
    const date = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString();
    const latestHistory = history?.[history.length - 1];

    return html`
      <div id="heading">
        <div>
          <span class="currency"><b>${currency}</b></span>
          <span class="desktop-only">Deposit Date: </span>
          ${date}
        </div>
        <div>
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
        <div class="details">
          <div>
            <span class="field-name">Cost:</span>
            <span class="field-value">${format(cost, 2)}</span>
            <span class="sub">in NTD,</span>
            <span class="field-name">Exchange Rate:</span>
            <span class="field-value">${format(exchangeRate)}</span>
          </div>
          ${latestHistory && pl ? html`
            <div class="amount">
              <div>
                <span class="field-name">Available Balance:</span>
                <span class="field-value">
                  ${format(revenue, 2)}
                </span>
                <span class="sub">in NTD,</span>
              </div>
              <div class="pl ${pl > 0 ? 'profit' : 'loss'}">
                ${format(pl, 2)}
                <span class="desktop-only">
                  &nbsp;
                  (${format((pl / cost) * 100, 1)}%)</span>
              </div>
            </div>
            ` : null
          }
        </div>
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
