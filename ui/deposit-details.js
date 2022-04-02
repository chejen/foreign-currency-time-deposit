import { html, css } from 'lit';
import BaseElement from './base';

/** Custom `deposit-details` component */
class DepositDetails extends BaseElement {
  static styles = css`
    :host {
      overflow: auto;
    }
  `;

  /**
   * To define a template for `deposit-details`
   * @return {TemplateResult} template result
   */
  render() {
    return html`<p>Deposit Details</p>`;
  }
}

customElements.define('deposit-details', DepositDetails);
