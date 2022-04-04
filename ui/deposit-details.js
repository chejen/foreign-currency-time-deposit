import { html, css } from 'lit';
import BaseElement from './base';
import './component-card';

/** Custom `deposit-details` component */
class DepositDetails extends BaseElement {
  static styles = css`
    :host {
      margin: 5px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    #operations {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 5px 10px;
      font-size: 0.9rem;
    }
    #btn-add {
      height: 1.8rem;
      border-radius: 4px;
      border: none;
      color: white;
      background-color: var(--color-primary);
      font-size: 0.9rem;
    }
    #btn-add span:first-child {
      font-size: 1.3rem;
      margin-right: 0.3rem;
    }
    #btn-add:hover {
      color: var(--color-secondary);
      cursor: pointer;
    }
    #btn-add:active {
      color: var(--color-dark);
      background-color: var(--color-secondary);
    }
    #sorting-wrapper, #btn-add {
      display: flex;
      align-items: center;
    }
    #sorting-wrapper label {
      color: var(--color-primary);
    }
    select {
      height: 1.8rem;
      outline: none;
      border-radius: 4px;
      border: 1px solid var(--color-primary);
      color: var(--color-primary);
      background-color: white;
      font-size: 0.9rem;
    }

    #cards {
      flex: 1;
      overflow-x: auto;
    }

    @media only screen and (min-width: 481px) {
      #cards component-card {
        margin: 15px 5px;
        border: 1px solid var(--color-light1);
      }
    }
    @media only screen and (max-width: 480px) {
      #cards component-card:not(:last-child) {
        border-bottom: 1px solid var(--color-secondary);
      }
    }
  `;

  /**
   * Perform corresponding sorting functions.
   * @param {object} event - change event
   */
  selectChangeHandler(event) {
    console.log(event.target.value);
  }

  /**
   * To define a template for `deposit-details`
   * @return {TemplateResult} template result
   */
  render() {
    return html`
      <div id="operations">
        <button id="btn-add">
          <span>&plus;</span>
          <span>Add</span>
        </button>
        <div id="sorting-wrapper">
          <label for="sorting">Sort by:</label>
          &nbsp;
          <select id="sorting" @change="${this.selectChangeHandler}">
            <option value="account-asc">Deposit Account (ASC)</option>
            <option value="account-desc">Deposit Account (DESC)</option>
            <option value="pl-asc">Profit and Loss (ASC)</option>
            <option value="account-desc">Profit and Loss (DESC)</option>
            <option value="currency">Currency</option>
            <option value="month">Month</option>
            <option value="month-current">
              Month (Starting from Current One)
            </option>
          </select>
        </div>
      </div>
      <div id="cards">
        <component-card></component-card>
        <component-card></component-card>
        <component-card></component-card>
        <component-card></component-card>
        <component-card></component-card>
        <component-card></component-card>
        <component-card></component-card>
        <component-card></component-card>
        <component-card></component-card>
        <component-card></component-card>
        <component-card></component-card>
        <component-card></component-card>
      </div>
    `;
  }
}

customElements.define('deposit-details', DepositDetails);
