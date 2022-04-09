import { css, html } from 'lit';
import BaseElement from './base';
import { createDepositAccount } from './actions';
import { ERROR_CODE } from './constants';

/** Custom `component-form` component */
class ComponentForm extends BaseElement {
  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
    }

    .input-field {
      display: flex;
      align-items: center;
      padding: 2px 5px;
    }
    .input-field input,
    .input-field select {
      flex: 1;
    }

    #btn-add {
      display: flex;
      align-items: center;
    }
    #btn-add span:first-child {
      font-size: 1.3rem;
      margin-right: 0.3rem;
    }
    #btn-add:hover {
      background-color: var(--color-secondary);
      color: var(--color-dark);
      cursor: pointer;
    }
    #btn-add:active {
      color: var(--color-primary);
    }

    @media only screen and (min-width: 1024px) {
      .input-wrapper {
        width: 33.33%;
      }
    }
    @media only screen and (min-width: 640px) and (max-width: 1024px) {
      .input-wrapper {
        width: 50%;
      }
    }
    @media only screen and (max-width: 640px) {
      .input-wrapper {
        width: 100%;
      }
    }
  `;

  static properties = {
    errAccount: {
      type: String,
      attribute: false,
    },
    errExchangeRate: {
      type: String,
      attribute: false,
    },
    errEquivalent: {
      type: String,
      attribute: false,
    },
  };

  /**
   * Invoked when the <component-form> is appended.
   */
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.addEventListener('input', this.inputHandler);
  }

  /**
   * Validate the data when the input values change
   * @param {InputEvent} event - input event
   */
  inputHandler = (event) => {
    const { id, value } = event.target;
    let newValue;
    switch (id) {
      case 'account_no':
        newValue = value.trim();
        this.errAccount = newValue ? '' : ERROR_CODE['01'];
        break;
      case 'exchange_rate':
        newValue = +value.trim();
        this.errExchangeRate = newValue ? '' :
          ERROR_CODE[isNaN(newValue) ? '02' : '01'];
        break;
      case 'original_currency_equivalent':
        newValue = +value.trim();
        this.errEquivalent = newValue ? '' :
          ERROR_CODE[isNaN(newValue) ? '02' : '01'];
        break;
    }
  };

  /**
   * Validate the input data and then create a new deposit account
   */
  btnClickHandler() {
    const root = this.shadowRoot;
    const account = root.getElementById('account_no').value.trim();
    const exchangeRate = +root.getElementById('exchange_rate').value.trim();
    const equivalent =
      +root.getElementById('original_currency_equivalent').value.trim();

    this.errAccount = account ? '' : ERROR_CODE['01'];
    this.errExchangeRate = exchangeRate ? '' :
      ERROR_CODE[isNaN(exchangeRate) ? '02' : '01'];
    this.errEquivalent = equivalent ? '' :
      ERROR_CODE[isNaN(equivalent) ? '02' : '01'];
    if (this.errAccount || this.errExchangeRate || this.errEquivalent) {
      return;
    }

    const date = root.getElementById('init_date').value.split('-');
    const data = {
      currency: root.getElementById('currency').value,
      exchange_rate: exchangeRate,
      cost: equivalent,
      year: +date[0],
      month: +date[1],
      day: +date[2],
    };
    createDepositAccount(account, data);
  }

  /**
   * Called when the <component-form> is removed.
   */
  disconnectedCallback() {
    this.shadowRoot.removeEventListener('input', this.inputHandler);
    super.disconnectedCallback();
  }

  /**
   * To define a template for `component-form`
   * @return {TemplateResult} template result
   */
  render() {
    return html`
      <div class="input-wrapper${this.errAccount ? ' error' : ''}">
        <div class="input-field">
          <label required for="account_no">Account</label>
          <input id="account_no" type="text" maxlength="13"></input>
        </div>
        ${this.errAccount ?
          html`<div class="message">${this.errAccount}</div>` :
          null}
      </div>

      <div class="input-wrapper">
        <div class="input-field">
          <label required for="currency">Currency</label>
          <select id="currency">
            <option value="USD" selected="selected">USD</option>
            <option value="CNY">CNY</option>
            <option value="AUD">AUD</option>
            <option value="NZD">NZD</option>
          </select>
        </div>
      </div>

      <div class="input-wrapper${this.errExchangeRate ? ' error' : ''}">
        <div class="input-field">
          <label required for="exchange_rate">Exchange Rate</label>
          <input id="exchange_rate" type="text" maxlength="10">
        </div>
        ${this.errExchangeRate ?
          html`<div class="message">${this.errExchangeRate}</div>` :
          null}
      </div>

      <div class="input-wrapper${this.errEquivalent ? ' error' : ''}">
        <div class="input-field">
          <label required for="original_currency_equivalent">
            Amount (in NTD)
          </label>
          <input id="original_currency_equivalent" type="text"></input>
        </div>
        ${this.errEquivalent ?
          html`<div class="message">${this.errEquivalent}</div>` :
          null}
      </div>

      <div class="input-wrapper">
        <div class="input-field">
          <label required for="init_date">Start Date</label>
          <input
            id="init_date"
            type="date"
            value="${new Date().toISOString().split('T')[0]}"
          >
          </input>
        </div>
      </div>

      <button id="btn-add" @click=${this.btnClickHandler}>
        <span>&plus;</span>
        <span>Add</span>
      </button>
    `;
  }
}

customElements.define('component-form', ComponentForm);
