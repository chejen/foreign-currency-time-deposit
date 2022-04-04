import { css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import BaseElement from './base';
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
  };

  /**
   * Create a shadow DOM for <component-card>.
   */
  constructor() {
    super();
    this.isTableCollapsed = true;
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
    const num = 290000;
    const arrowClasses = {
      arrow: true,
      rotate: !this.isTableCollapsed,
    };
    const tableClasses = {
      show: !this.isTableCollapsed,
    };
    return html`
      <div id="heading">
        <div id="date">
          <span class="desktop-only">Deposit Date: </span>
          2020/02/20
        </div>
        <div id="account">
          <span class="desktop-only">Account: </span>123456789
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
            <span class="digits">100000</span> in USD
            <span class="exchange-rate">(exchange rate: 29.5123)</span>
          </div>
          <div class="original-equivalent">
            <span class="digits">
              ${num.toLocaleString('en', { useGrouping: true })}
            </span>
            in NTD equivalent
          </div>
        </div>
        <div class="amount desktop-only">
          <div class="field-name desktop-only">Available Balance:</div>
          <div class="foreign-currency">
            <span class="digits">100000</span> in USD
          </div>
          <div class="original-equivalent">
            <div>
              <span class="digits">
                ${num.toLocaleString('en', { useGrouping: true })}
              </span>
              in NTD equivalent
            </div>
          </div>
        </div>
        <div class="pl">-50000</div>
      </div>
      <component-table class="${classMap(tableClasses)}"></component-table>
    `;
  }
}

customElements.define('component-card', ComponentCard);
