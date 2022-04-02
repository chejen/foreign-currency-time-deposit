import { LitElement, html } from 'lit';

/** Custom `deposit-overview` component */
class DepositOverview extends LitElement {
  /**
   * To define a template for `deposit-overview`
   * @return {TemplateResult} template result
   */
  render() {
    return html`<p>Deposit Overview</p>`;
  }
}

customElements.define('deposit-overview', DepositOverview);
