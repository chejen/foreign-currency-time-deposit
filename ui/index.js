import { html, css } from 'lit';
import BaseElement from './base';
import './deposit-overview';
import './deposit-details';
import { firebaseConfig } from './actions';

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
   * To define a template for `time-deposit`
   * @return {TemplateResult} template result
   */
  render() {
    return firebaseConfig ?
      html`
        <deposit-overview></deposit-overview>
        <deposit-details></deposit-details>
      ` :
      html`<div class="error message">
        There is something wrong with your firebaseConfig!
      </div>`;
  }
}

customElements.define('time-deposit', TimeDeposit);
