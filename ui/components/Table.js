import { css, html } from 'lit';
import BaseElement from './BaseElement';
import { updateDepositHistory } from '../actions';
import { HEADER_NAME } from '../constants';
import { format, toFixed } from '../utils';

const {
  INTEREST_START_DATE,
  INTEREST_END_DATE,
  INTEREST_RATE,
  PRINCIPAL_AMOUNT,
  GROSS_INTEREST_AMOUNT,
  AVAILABLE_BALANCE,
} = HEADER_NAME;

/** Custom `component-table` component */
class Table extends BaseElement {
  static styles = css`
    table {
      width: 100%;
    }
    table th {
      height: 35px;
      background-color: var(--color-dark);
      color: wheat;
    }
    table tr:nth-child(odd) {
      background-color: lightgray;
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
      table tr:nth-child(odd) {
        background-color: var(--color-light2);
      }
      table td {
        display: flex;
        text-align: left;
        padding: 3px;
        align-items: center;
        justify-content: space-between;
      }
      table td::before {
        content: attr(data-th);
        flex: 3;
      }
      table component-input {
        --text-align: right;
        padding: 1px 0;
        flex: 2;
      }
    }
    @media only screen and (max-width: 480px) {
      :host {
        margin: 0 0 0 30px;
      }
      table {
        border-collapse: collapse;
      }
      table tr:not(:first-child):not(:last-child) {
        border-bottom: 1px solid var(--color-light1);
        padding: 3px 0;
        display: block;
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
  };

  /**
   * Create a shadow DOM for <component-table>.
   */
  constructor() {
    super();
    this.deposit = {};
  }

  /**
   * Update deposit history if the data are valid
   * @param {MouseEvent} event - a mouse click event
   */
  btnClickHandler(event) {
    if (event.target.tagName !== 'BUTTON') return;

    const tr = event.currentTarget;
    const principalAmount = tr.querySelector('#time_deposit_amount');
    const grossAmount =
      tr.querySelector('#received_gross_interest_amount');
    const interestRate = tr.querySelector('#interest_rate');

    const isPrincipalAmountValid = principalAmount.type === 'hidden' ||
      principalAmount.isValid;
    const isGrossAmountValid = grossAmount.isValid;
    const isInterestRateValid = interestRate.isValid;
    if (
      !isPrincipalAmountValid ||
      !isGrossAmountValid ||
      !isInterestRateValid
    ) {
      return;
    }

    updateDepositHistory(
      tr.querySelector('#time_deposit_account').value,
      {
        interest_start_year:
          +tr.querySelector('#interest_start_year').value,
        // may be a string if it's from <input type="hidden">
        time_deposit_amount: +principalAmount.value,
        received_gross_interest_amount: grossAmount.value,
        interest_rate: interestRate.value,
      },
    );
  }

  /**
   * Render deposit history to the table
   * @return {TemplateResult} template result
   */
  renderData() {
    const {
      history,
      month,
      day,
    } = this.deposit;

    return html`
      ${history?.length ?
        history.map(({
          interest_start_year: startYear,
          time_deposit_amount: depositAmount,
          received_gross_interest_amount: grossAmount,
          interest_rate: interestRate,
        }) => html`
          <tr>
            <td data-th="${INTEREST_START_DATE}">
              ${new Date(Date.UTC(startYear, month - 1, day))
                .toLocaleDateString()}
            </td>
            <td data-th="${INTEREST_END_DATE}">
              ${new Date(Date.UTC(startYear + 1, month - 1, day))
                .toLocaleDateString()}
            </td>
            <td data-th="${PRINCIPAL_AMOUNT}">${format(depositAmount)}</td>
            <td data-th="${INTEREST_RATE} (%)">${interestRate}</td>
            <td data-th="${GROSS_INTEREST_AMOUNT}">${format(grossAmount)}</td>
            <td data-th="${AVAILABLE_BALANCE}">
              ${format(depositAmount + grossAmount)}
            </td>
          </tr>
        `) : null
      }
    `;
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
    // (endYr = startYr + 1)
    // There would be a new record if the difference
    // between "today" and "the next yr of the last endYr"
    // is more than 1 yr
    const lastEndYear = latestHistory ?
      latestHistory.interest_start_year + 1 :
      year;
    const isExpired = Date.UTC(lastEndYear + 1, month - 1, day) < Date.now();
    const availableBalance = latestHistory ? toFixed(
      latestHistory.time_deposit_amount,
      latestHistory.received_gross_interest_amount,
    ) : 0;

    if (!isExpired) {
      return null;
    }

    return html`
      <tr @click="${this.btnClickHandler}">
        <td data-th="${INTEREST_START_DATE}">
          <input
            type="hidden"
            id="time_deposit_account"
            value="${account}"
          >
          <input
            type="hidden"
            id="interest_start_year"
            value="${lastEndYear}"
          >
          ${new Date(
            Date.UTC(lastEndYear, month - 1, day),
          ).toLocaleDateString()}
        </td>
        <td data-th="${INTEREST_END_DATE}">
          ${new Date(Date.UTC(lastEndYear + 1, month - 1, day))
            .toLocaleDateString()
          }
        </td>
        <td
          data-th="${PRINCIPAL_AMOUNT}"
          class="${this.errDepositAmount ? ' error' : ''}"
        >
          ${latestHistory ? html`
            <input
              type="hidden"
              id="time_deposit_amount"
              value=${availableBalance}
            >
            ${format(availableBalance)}
          ` : html`
            <component-input
              id="time_deposit_amount"
              maxlength="9"
              type="number"
              required
            >
            </component-input>
          `}
        </td>
        <td data-th="${INTEREST_RATE} (%)">
          <component-input
            id="interest_rate"
            maxlength="7"
            type="number"
            required
          >
          </component-input>
        </td>
        <td data-th="${GROSS_INTEREST_AMOUNT}">
          <component-input
            id="received_gross_interest_amount"
            maxlength="9"
            type="number"
            required
          >
          </component-input>
        </td>
        <td data-th="">
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
    return html`<table>
      <tr>
        <th>${INTEREST_START_DATE}</th>
        <th>${INTEREST_END_DATE}</th>
        <th>${PRINCIPAL_AMOUNT}</th>
        <th>${INTEREST_RATE} (%)</th>
        <th>${GROSS_INTEREST_AMOUNT}</th>
        <th>${this.deposit.history?.length ? AVAILABLE_BALANCE : ''}</th>
      </tr>
      ${this.renderData()}
      ${this.renderInputRow()}
    </table>`;
  }
}

customElements.define('component-table', Table);
