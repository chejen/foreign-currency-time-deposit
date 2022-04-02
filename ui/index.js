import { LitElement, html } from 'lit';

/** Custom `time-deposit` component */
class TimeDeposit extends LitElement {
  /**
   * To define a template for `time-deposit`
   * @return {TemplateResult} template result
   */
  render() {
    return html`<p>Time deposit</p>`;
  }
}

customElements.define('time-deposit', TimeDeposit);
