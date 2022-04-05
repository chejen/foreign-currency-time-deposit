import { html, css } from 'lit';
import BaseElement from './base';
import './component-toast';
import './deposit-overview';
import './deposit-details';
import {
  initializationError,
  getDeposits,
} from './actions';

/** Custom `time-deposit` component */
class TimeDeposit extends BaseElement {
  static styles = css`
    :host {
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
      flex: 1;
    }
    @media only screen and (max-width: 480px) {
      :host {
        align-items: unset;
      }
    }
  `;

  /**
   * Invoked when the <time-deposit> is appended.
   */
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('depositlistchanged', this);
    if (!initializationError) {
      getDeposits();
    }
  }

  /**
   * A event handler for time-deposit
   * @param {CustomEvent} event A custom event
   */
  handleEvent = (event) => {
    const { success, type } = event.detail;
    switch (type) {
      case 'getDeposits':
        !success && window.dispatchEvent(new CustomEvent('toastshow', {
          detail: {
            message: 'Failed to load deposit list.',
            type: 'error',
          },
        }));
        break;
      case 'createDepositAccount':
        window.dispatchEvent(new CustomEvent('toastshow', {
          detail: {
            message: success ?
              'Successfully add a deposit account.':
              'Failed to add a deposit account.',
            type: success ? 'success' : 'error',
          },
        }));
        break;
    }
  };

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
        <deposit-overview></deposit-overview>
        <deposit-details></deposit-details>
      `;
  }
}

customElements.define('time-deposit', TimeDeposit);
