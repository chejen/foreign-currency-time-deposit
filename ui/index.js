import { html, css } from 'lit';
import BaseElement from './base';
import './component-toast';
import './deposit-overview';
import './deposit-details';
import {
  initializationError,
  getDeposits,
  getExchangeRates,
} from './actions';

/** Custom `time-deposit` component */
class TimeDeposit extends BaseElement {
  static styles = css`
    :host {
      width: 100%;
      max-width: 1280px;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .message {
      border: 1px solid var(--color-red);
      border-radius: 3px;
      padding: 10px;
      margin-top: 30px;
    }
    deposit-details {
      overflow: hidden;
      flex: 1;
    }
    @media only screen and (max-width: 480px) {
      :host {
        align-items: unset;
      }
      deposit-overview {
        max-height: 30%;
      }
    }
  `;

  static properties = {
    deposits: {
      type: Array,
      attribute: false,
    },
    exchangeRates: {
      type: Object,
      attribute: false,
    },
  };

  /**
   * Invoked when the <time-deposit> is appended.
   */
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('depositlistchanged', this);
    if (!initializationError) {
      getDeposits();
      getExchangeRates().then(({ result, success }) => {
        this.exchangeRates = result;
        !success && this.showToast('Failed to load exchange rates.', 'error');
      });
    }
  }

  /**
   * A event handler for time-deposit
   * @param {CustomEvent} event A custom event
   */
  handleEvent = (event) => {
    const { success, type, result } = event.detail;
    let message;
    this.deposits = result;
    switch (type) {
      case 'getDeposits':
        !success && this.showToast('Failed to load deposit list.', 'error');
        return;
      case 'createDepositAccount':
        message = success ?
          'Successfully add a deposit account.' :
          'Failed to add a deposit account.';
        break;
      case 'updateDepositHistory':
        message = success ?
          'Successfully update deposit history.' :
          'Failed to update deposit history.';
        break;
    }
    this.showToast(message, success ? 'success' : 'error');
  };

  /**
   * Reveal a toast.
   * @param {string} message The message expected to be displayed
   * @param {string} type The toast type
   */
  showToast(message, type) {
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent('toastshow', {
        detail: {
          message,
          type,
        },
      }));
    });
  }

  /**
   * Called when the <time-deposit> is removed.
   */
  disconnectedCallback() {
    window.removeEventListener('depositlistchanged', this);
    super.disconnectedCallback();
  }

  /**
   * To define a template for `time-deposit`
   * @return {TemplateResult} template result
   */
  render() {
    return initializationError ?
      html`<div class="error message">${initializationError}</div>` :
      html`
        <deposit-overview
          .deposits="${this.deposits}"
          .exchangeRates="${this.exchangeRates}"
        >
        </deposit-overview>
        <deposit-details .deposits="${this.deposits}"></deposit-details>
      `;
  }
}

customElements.define('time-deposit', TimeDeposit);
