import { html, css } from 'lit';
import BaseElement from './base';
import './component-card';

/** Custom `deposit-details` component */
class DepositDetails extends BaseElement {
  static styles = css`
    :host {
      overflow: auto;
      margin: 5px;
    }

    #operations {
      display: flex;
      justify-content: flex-end;
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
   * To define a template for `deposit-details`
   * @return {TemplateResult} template result
   */
  render() {
    return html`
      <div id="operations">Sort by:</div>
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
