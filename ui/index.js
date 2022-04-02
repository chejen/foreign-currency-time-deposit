import { LitElement, html, css } from 'lit';
import './deposit-overview';
import './deposit-details';

/** Custom `time-deposit` component */
class TimeDeposit extends LitElement {
  static styles = css`
    :host {
      max-width: 1280px;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
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
    return html`
      <deposit-overview></deposit-overview>
      <deposit-details></deposit-details>
    `;
  }
}

customElements.define('time-deposit', TimeDeposit);
