import { css, html } from 'lit';
import BaseElement from './base';

/** Custom `component-table` component */
class ComponentTable extends BaseElement {
  static styles = css`
    table {
      width: 100%;
      background-color: var(--color-light2);
    }
    table th {
      text-decoration: underline;
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
        border: 1px solid var(--color-light1);
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
      table {
        border: unset;
      }
      table tr:nth-child(even) {
        background-color: unset;
      }
      table td {
        padding: 1px 5px;
      }
    }
  `;

  /**
   * To define a template for `component-table`
   * @return {TemplateResult} template result
   */
  render() {
    return html`<table>
      <tr>
        <th>Interest Start Date</th>
        <th>Interest End Date</th>
        <th>Amount</th>
        <th>Gross Interest Amount</th>
        <th>Interest Rate (%)</th>
        <th>Available Balance</th>
      </tr>
      <tr>
        <td data-th="Interest Start Date">1</td>
        <td data-th="Interest End Date">2</td>
        <td data-th="Deposit Amount">3</td>
        <td data-th="Gross Interest Amount">4</td>
        <td data-th="Interest Rate (%)">5</td>
        <td data-th="Available Balance">6</td>
      </tr>
      <tr>
        <td data-th="Interest Start Date">1</td>
        <td data-th="Interest End Date">2</td>
        <td data-th="Deposit Amount">3</td>
        <td data-th="Gross Interest Amount">4</td>
        <td data-th="Interest Rate (%)">5</td>
        <td data-th="Available Balance">6</td>
      </tr>
      <tr>
        <td data-th="Interest Start Date">1</td>
        <td data-th="Interest End Date">2</td>
        <td data-th="Deposit Amount">3</td>
        <td data-th="Gross Interest Amount">4</td>
        <td data-th="Interest Rate (%)">5</td>
        <td data-th="Available Balance">6</td>
      </tr>
    </table>`;
  }
}

customElements.define('component-table', ComponentTable);
