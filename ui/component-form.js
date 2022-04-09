import { css, html } from 'lit';
import BaseElement from './base';
import { createDepositAccount } from './actions';
import './component-input';

/** Custom `component-form` component */
class ComponentForm extends BaseElement {
  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

    component-input {
      padding: 2px 5px;
    }

    #btn-add {
      margin-left: 5px;
      display: flex;
      align-items: center;
    }
    #btn-add span:first-child {
      font-size: 1.3rem;
      margin-right: 0.3rem;
    }

    @media only screen and (min-width: 1024px) {
      component-input {
        width: 33.33%;
      }
    }
    @media only screen and (min-width: 640px) and (max-width: 1024px) {
      component-input {
        width: 50%;
      }
    }
    @media only screen and (max-width: 640px) {
      component-input {
        width: 100%;
      }
    }
  `;

  /**
   * Validate the input data and then create a new deposit account
   */
  btnClickHandler() {
    const root = this.shadowRoot;
    const account = root.getElementById('account_no');
    const exchangeRate = root.getElementById('exchange_rate');
    const equivalent = root.getElementById('original_currency_equivalent');

    const isAccountValid = account.isValid;
    const isExchangeRateValid = exchangeRate.isValid;
    const isEquivalentValid = equivalent.isValid;
    if (!isAccountValid || !isExchangeRateValid || !isEquivalentValid) {
      return;
    }

    const date = root.getElementById('init_date').value.split('-');
    const data = {
      currency: root.getElementById('currency').value,
      exchange_rate: exchangeRate.value,
      cost: equivalent.value,
      year: +date[0],
      month: +date[1],
      day: +date[2],
    };
    createDepositAccount(account, data);
  }

  /**
   * To define a template for `component-form`
   * @return {TemplateResult} template result
   */
  render() {
    return html`
      <component-input id="account_no" label="Account" maxlength="13" required>
      </component-input>

      <component-input
        id="currency"
        label="Currency"
        type="select"
        required
        .options="${[{
          name: 'AUD', value: 'AUD',
        }, {
          name: 'CNY', value: 'CNY',
        }, {
          name: 'NZD', value: 'NZD',
        }, {
          name: 'USD', value: 'USD',
        }]}"
      >
      </component-input>

      <component-input
        id="exchange_rate"
        label="Exchange Rate"
        maxlength="7"
        type="number"
        required
      >
      </component-input>

      <component-input
        id="original_currency_equivalent"
        label="Amount (in NTD)"
        maxlength="9"
        type="number"
        required
      >
      </component-input>

      <component-input
        id="init_date"
        label="Start Date"
        type="data"
        initvalue="${new Date().toISOString().split('T')[0]}"
        required
      >
      </component-input>

      <button id="btn-add" @click=${this.btnClickHandler}>
        <span>&plus;</span>
        <span>Add</span>
      </button>
    `;
  }
}

customElements.define('component-form', ComponentForm);
