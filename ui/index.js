import { html, css } from 'lit';
import BaseElement from './base';
import './component-input';
import './component-toast';
import './deposit-overview';
import './deposit-details';
import {
  initializationError,
  signInWithAuth,
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
    .loading {
      text-align: center;
    }
    .auth {
      padding: 25px;
      text-align: center;
    }
    .auth img {
      margin: 10px 0;
    }
    .auth component-input {
      display: block;
      margin: 10px 0;
    }
    deposit-details {
      overflow: hidden;
      flex: 1;
    }
    @media only screen and (min-width: 481px) {
      .auth {
        margin-top: 30px;
        border: 1px solid var(--color-primary);
        border-raduis: 3px;
      }
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
    user: {
      type: Object,
      attribute: false,
    },
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
    window.addEventListener('load', () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js');
      }
    }, { once: true });
    window.addEventListener('authstatechanged', this);
    window.addEventListener('depositlistchanged', this);
    if (!initializationError && process.env.auth !== 'email') {
      this.getData();
    }
  }

  /**
   * Get deposits and exchange rates
   */
  getData() {
    if (process.env.auth !== 'email' || this.user?.email) {
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

    if (event.type === 'authstatechanged') {
      if (!success) {
        this.showToast(`Failed to sign in (${result})`, 'error');
        return;
      }
      this.user = result;
      this.getData();
      return;
    }

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
      default: // sortDepositList, calculateROI
        return;
    }
    this.showToast(message, success ? 'success' : 'error');
  };

  /**
   * Perform signIn() if the Enter key is pressed
   * @param {KeyboardEvent} event The keydown event
   */
  keydownHandler(event) {
    if (event.key === 'Enter') {
      this.signIn();
    }
  }

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
   * Email address and password sign-in
   */
  signIn() {
    const email = this.shadowRoot.getElementById('email');
    const pwd = this.shadowRoot.getElementById('pwd');
    const isEmailValid = email.isValid;
    const isPwdValid = pwd.isValid;
    if (isEmailValid && isPwdValid) {
      signInWithAuth(email.value, pwd.value);
    }
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
      (process.env.auth === 'email' && !this.user?.email) ?
        (this.user ?
          html`
            <div class="auth">
              <img src="/deposit.png" width="256" height="256" />
              <component-input
                id="email"
                label="E-mail"
                required
                @keydown=${this.keydownHandler}
              >
              </component-input>
              <component-input
                id="pwd"
                label="Password"
                type="password"
                required
                @keydown=${this.keydownHandler}
              >
              </component-input>
              <button @click=${this.signIn}>Sign in</button>
            </div>
          ` :
          html `
            <div class="loading">
              <img src="./loading.gif" width="96px" height="96px" />
            </div>
          `
        ) :
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
