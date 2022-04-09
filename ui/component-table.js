import { css, html } from 'lit';
import BaseElement from './base';
import { updateDepositHistory } from './actions';
import { ERROR_CODE } from './constants';
import { format, toFixed } from './utils';

/** Custom `component-table` component */
class ComponentTable extends BaseElement {
  static styles = css`
    table {
      width: 100%;
      background-color: var(--color-light2);
    }
    table tr:nth-child(even) {
      background-color: white;
    }
    table td {
      text-align: center;
    }

    @media only screen and (max-width: 768px) {
      table {
        background-color: unset;
      }
      table th {
        display: none;
      }
      table tr:nth-child(even) {
        background-color: var(--color-light2);
      }
      table td {
        display: block;
        text-align: left;
        padding: 3px;
      }
      table td::before {
        content: attr(data-th);
        display: inline-block;
        width: 50%;
      }
    }
    @media only screen and (max-width: 480px) {
      :host {
        width: 85%;
        margin: 0 auto 10px;
      }
      table {
        border-collapse: collapse;
      }
      table tr:nth-child(even) {
        background-color: unset;
      }
      table tr:not(:first-child):not(:last-child) {
        border-bottom: 1px solid var(--color-light1);
      }
      table td {
        padding: 1px 5px;
      }
    }
  `;

  static properties = {
    deposit: {
      type: Object,
      attribute: false,
    },
    errDepositAmount: {
      type: String,
      attribute: false,
    },
    errGrossAmount: {
      type: String,
      attribute: false,
    },
    errInterestRate: {
      type: String,
      attribute: false,
    },
  };

  /**
   * Create a shadow DOM for <component-table>.
   */
  constructor() {
    super();
    this.deposit = {};
  }

  /**
   * Invoked when the <component-table> is appended.
   */
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.addEventListener('input', this.inputHandler);
  }

  /**
   * Called when the <component-table> is removed.
   */
  disconnectedCallback() {
    this.shadowRoot.removeEventListener('input', this.inputHandler);
    super.disconnectedCallback();
  }

  /**
   * Validate the data when the input values change
   * @param {InputEvent} event - input event
   */
  inputHandler = (event) => {
    const { name, value } = event.target;
    const newValue = +value.trim();
    const errorMessage = newValue ? '' :
      ERROR_CODE[isNaN(newValue) ? '02' : '01'];
    switch (name) {
      case 'time_deposit_amount':
        this.errDepositAmount = errorMessage;
        break;
      case 'received_gross_interest_amount':
        this.errGrossAmount = errorMessage;
        break;
      case 'interest_rate':
        this.errInterestRate = errorMessage;
        break;
    }
  };

  /**
   * Update deposit history if the data are valid
   * @param {MouseEvent} event - a mouse click event
   */
  btnClickHandler(event) {
    if (event.target.tagName !== 'BUTTON') return;

    const tr = event.currentTarget;
    const account = tr.querySelector('[name=time_deposit_account]').value;
    const startYear = +tr.querySelector('[name=interest_start_year]').value;
    const depositAmount =
      +tr.querySelector('[name=time_deposit_amount]').value;
    const grossAmount =
      +tr.querySelector('[name=received_gross_interest_amount]').value;
    const interestRate = +tr.querySelector('[name=interest_rate]').value;

    this.errDepositAmount = depositAmount ? '' :
      ERROR_CODE[isNaN(depositAmount) ? '02' : '01'];
    this.errGrossAmount = grossAmount ? '' :
      ERROR_CODE[isNaN(grossAmount) ? '02' : '01'];
    this.errInterestRate = interestRate ? '' :
      ERROR_CODE[isNaN(interestRate) ? '02' : '01'];
    if (
      this.errDepositAmount ||
      this.errGrossAmount ||
      this.errInterestRate
    ) {
      return;
    }

    updateDepositHistory(account, {
      interest_start_year: startYear,
      time_deposit_amount: depositAmount,
      received_gross_interest_amount: grossAmount,
      interest_rate: interestRate,
    });
  }

  /**
   * Provide the input fields to add deposit history
   * @return {TemplateResult} template result
   */
  renderInputRow() {
    const {
      time_deposit_account: account,
      year,
      month,
      day,
      history,
    } = this.deposit;
    const latestHistory = history?.[history.length - 1];
    const isExpired = latestHistory ?
      (
        Date.UTC(latestHistory.interest_start_year + 1, month - 1, day) <
        Date.now()
      ) :
      null;
    const availableBalance = latestHistory ? toFixed(
      latestHistory.time_deposit_amount,
      latestHistory.received_gross_interest_amount,
    ) : 0;

    if (history && !isExpired) {
      return null;
    }

    const startYear = isExpired ? latestHistory.interest_start_year + 1 : year;
    return html`
      <tr @click="${this.btnClickHandler}">
        <td data-th="Interest Start Date">
          <input
            type="hidden"
            name="time_deposit_account"
            value="${account}"
          >
          <input
            type="hidden"
            name="interest_start_year"
            value="${startYear}"
          >
          ${new Date(Date.UTC(startYear, month - 1, day)).toLocaleDateString()}
        </td>
        <td data-th="Interest End Date">
          ${new Date(Date.UTC(startYear + 1, month - 1, day))
            .toLocaleDateString()
          }
        </td>
        <td
          data-th="Deposit Amount"
          class="${this.errDepositAmount ? ' error' : ''}"
        >
          ${latestHistory ? html`
            <input
              type="hidden"
              name="time_deposit_amount"
              value=${availableBalance}
            >
            ${format(availableBalance)}
          ` : html`
            <input name="time_deposit_amount" type="text">
            ${this.errDepositAmount ?
              html`<div class="message">${this.errDepositAmount}</div>` :
              null
            }
          `}
        </td>
        <td
          data-th="Gross Interest Amount"
          class="${this.errGrossAmount ? ' error' : ''}"
        >
          <input name="received_gross_interest_amount" type="text">
          ${this.errGrossAmount ?
            html`<div class="message">${this.errGrossAmount}</div>` :
            null
          }
        </td>
        <td
          data-th="Interest Rate (%)"
          class="${this.errInterestRate ? ' error' : ''}"
        >
          <input name="interest_rate" type="text">
          ${this.errInterestRate ?
            html`<div class="message">${this.errInterestRate}</div>` :
            null
          }
        </td>
        <td data-th="Available Balance">
          <button>Add</button>
        </td>
      </tr>
    `;
  }

  /**
   * To define a template for `component-table`
   * @return {TemplateResult} template result
   */
  render() {
    const {
      history,
      month,
      day,
    } = this.deposit;

    return html`<table>
      <tr>
        <th>Interest Start Date</th>
        <th>Interest End Date</th>
        <th>Amount</th>
        <th>Gross Interest Amount</th>
        <th>Interest Rate (%)</th>
        <th>Available Balance</th>
      </tr>
      ${history?.length ?
        history.map(({
          interest_start_year: startYear,
          time_deposit_amount: depositAmount,
          received_gross_interest_amount: grossAmount,
          interest_rate: interestRate,
        }) => {
          return html`<tr>
            <td data-th="Interest Start Date">
              ${new Date(Date.UTC(startYear, month - 1, day))
                .toLocaleDateString()}
            </td>
            <td data-th="Interest End Date">
              ${new Date(Date.UTC(startYear + 1, month - 1, day))
                .toLocaleDateString()}
            </td>
            <td data-th="Amount">${format(depositAmount)}</td>
            <td data-th="Gross Interest Amount">${format(grossAmount)}</td>
            <td data-th="Interest Rate (%)">${interestRate}</td>
            <td data-th="Available Balance">
              ${format(depositAmount + grossAmount)}
            </td>
          </tr>`;
        }) : null
      }
      ${this.renderInputRow()}
    </table>`;
  }
}

customElements.define('component-table', ComponentTable);
