import { html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { sortDepositList } from './actions';
import BaseElement from './components/BaseElement';
import './components/Form';
import './components/Card';

/** Custom `deposit-details` component */
class DepositDetails extends BaseElement {
  static styles = css`
    :host {
      margin: 5px 5px 10px;
      display: flex;
      flex-direction: column;
    }
    #operations {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 5px 10px;
    }
    #operations * {
      color: var(--color-darkblue);
    }
    .symbol-button {
      display: none;
    }
    #sorting {
      border: 1px solid var(--color-darkblue);
    }
    #cards {
      flex: 1;
      overflow-x: auto;
    }
    .no-data {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--color-light1);
      font-size: 0.9rem;
    }

    @media only screen and (max-width: 768px) {
      :host {
        width: 100%;
      }
      component-form {
        display: none;
        opacity: 0;
      }
      component-form.show {
        display: flex;
        opacity: 0;
        width: 100%;
        animation: fade-in .2s ease 0.1s;
        animation-fill-mode: forwards;
      }
      @keyframes fade-in {
        0% {
          opacity: 0;
          transform: translate(0, 10%);
        }
        100% {
          opacity: 1;
          transform: translate(0, 0);
        }
      }
      .symbol-button {
        display: block;
        font-size: 1.3rem;
        font-weight: 700;
        border: 2px solid var(--color-darkblue);
        border-radius: 0.9rem;
        width: 1.6rem;
        height: 1.6rem;
        text-align: center;
        transition: .2s;
        transition-delay: .1s;
      }
      .symbol-button.active {
        transform: rotate(315deg);
      }
      #cards component-card:not(:last-child) {
        border-bottom: 1px solid var(--color-secondary);
      }
    }
    @media only screen and (min-width: 481px) {
      #cards component-card {
        margin: 0 0 25px;
      }
    }
    @media only screen and (max-width: 480px) {
      :host {
        width: unset;
      }
    }
  `;

  static properties = {
    isFormHidden: {
      type: Boolean,
      attribute: false,
    },
    deposits: {
      type: Array,
      attribute: false,
    },
  };

  /**
   * Create a shadow DOM for <deposit-details>.
   */
  constructor() {
    super();
    this.isFormHidden = true;
    this.deposits = [];
  }

  /**
   * Toggle the addition form
   */
  symbolClickHandler() {
    this.isFormHidden = !this.isFormHidden;
  }

  /**
   * Perform corresponding sorting functions.
   * @param {object} event - change event
   */
  selectChangeHandler(event) {
    const param = event.target.value.split('-');
    sortDepositList(param[0], param.length > 1 ? {
      [param[1]]: param[2],
    } : undefined);
  }

  /**
   * To define a template for `deposit-details`
   * @return {TemplateResult} template result
   */
  render() {
    const formClasses = {
      'show': !this.isFormHidden,
    };
    const symbolClasses = {
      'symbol-button': true,
      'active': !this.isFormHidden,
    };
    return html`
      <component-form class="${classMap(formClasses)}"></component-form>
      <div id="operations">
        <div>
          <div
            class="${classMap(symbolClasses)}"
            @click="${this.symbolClickHandler}"
          >
            &plus;
          </div>
        </div>
        <div id="sorting-wrapper">
          <label for="sorting">Sort by</label>
          <select id="sorting" @change="${this.selectChangeHandler}">
            <option value="account">Deposit Account (ASC)</option>
            <option value="account-orderby-desc">Deposit Account (DESC)</option>
            <option value="pl">Profit and Loss (ASC)</option>
            <option value="pl-orderby-desc">Profit and Loss (DESC)</option>
            <option value="currency">Currency (ASC)</option>
            <option value="currency-orderby-desc">Currency (DESC)</option>
            <option value="month">Month</option>
            <option value="month-from-current">
              Month (Starting from Current One)
            </option>
          </select>
        </div>
      </div>
      <div id="cards">
        ${this.deposits?.length ?
          null :
          html`<div class="no-data">${
            this.deposits ?
              html`No time deposit records` :
              html`<img src="./images/loading.gif" width="96" height="96" />`
          }</div>`
        }
        ${this.deposits?.map((deposit) => (
          html`<component-card .deposit="${deposit}"></component-card>`
        ))}
      </div>
    `;
  }
}

customElements.define('deposit-details', DepositDetails);
