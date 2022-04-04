import { css, html } from 'lit';
import BaseElement from './base';

const ERROR_CODE = Object.freeze({
  '01': 'This field is required.',
  '02': 'This field must be a number.',
});

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
    .error input {
      border-color: var(--color-red);
    }
    .error .message {
      font-size: 0.8rem;
      color: var(--color-red);
      text-align: right;
      padding-right: 8px;
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

  /**
   * Get the values from all inputs
   */
  btnClickHandler() {
    console.log(
        this.shadowRoot.getElementById('account_no').value,
        this.shadowRoot.getElementById('currency').value,
        +this.shadowRoot.getElementById('exchange_rate').value,
        +this.shadowRoot.getElementById('original_currency_equivalent').value,
        this.shadowRoot.getElementById('init_date').value.replace(/-/g, '/'),
    );
  }

  /**
   * To define a template for `component-form`
   * @return {TemplateResult} template result
   */
  render() {
    return html`
      <div class="input-wrapper error">
        <div class="input-field">
          <label required for="account_no">Account</label>
          <input id="account_no" type="text" maxlength="13"></input>
        </div>
        <div class="message">${ERROR_CODE['01']}</div>
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

      <div class="input-wrapper error">
        <div class="input-field">
          <label required for="exchange_rate">Exchange Rate</label>
          <input id="exchange_rate" type="text" maxlength="10">
        </div>
        <div class="message">${ERROR_CODE['02']}</div>
      </div>

      <div class="input-wrapper error">
        <div class="input-field">
          <label required for="original_currency_equivalent">
            Amount (in NTD)
          </label>
          <input id="original_currency_equivalent" type="text"></input>
        </div>
        <div class="message">${ERROR_CODE['02']}</div>
      </div>

      <div class="input-wrapper">
        <div class="input-field">
          <label required for="init_date">Start Date</label>
          <input id="init_date" type="date"></input>
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
