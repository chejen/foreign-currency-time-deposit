import { css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import BaseElement from './base';

/** Custom `component-toast` component */
class ComponentToast extends BaseElement {
  static styles = css`
    .wrapper {
      --toast-width: 300px;
      position: fixed;
      z-index: var(--z-index-toast);
      width: var(--toast-width);
      left: 50%;
      margin-left: calc(0px - var(--toast-width) / 2);
      padding: 3px;
      border-radius: 5px;
      background-color: white;
      opacity: 0;
      transform: translateY(-100%);
      transition: transform .75s, opacity .75s;
    }
    .content {
      padding: 1rem;
      border: 3px solid var(--color-red);
      border-radius: 5px;
    }
    .error {
      border: 3px solid var(--color-red);
      color: var(--color-red);
    }
    .success {
      border: 3px solid var(--color-green);
      color: var(--color-green);
    }
    .info {
      border: 3px solid var(--color-primary);
      color: var(--color-primary);
    }
    .show {
      opacity: .95;
      transform: translateY(100px);
    }
  `;

  static properties = {
    show: {
      type: Boolean,
    },
    message: {
      type: String,
    },
    type: {
      type: String,
    },
  };

  /**
   * Invoked when the <component-toast> is appended.
   */
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('toastshow', this);
  }

  /**
   * A event handler for component-toast
   * @param {CustomEvent} event A custom event
   */
  handleEvent(event) {
    const { message, type } = event.detail;
    this.message = message;
    this.type = type;
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 3000);
  }

  /**
   * Called when the <component-toast> is removed.
   */
  disconnectedCallback() {
    window.addEventListener('toastshow', this);
    super.disconnectedCallback();
  }

  /**
   * To define a template for `component-toast`
   * @return {TemplateResult} template result
   */
  render() {
    const wrapperClasses = {
      wrapper: true,
      show: this.show,
    };
    const contentClasses = {
      content: true,
      [this.type || 'info']: true,
    };
    return html`
      <div class="${classMap(wrapperClasses)}">
        <div class="${classMap(contentClasses)}">
          ${this.message}
        </div>
      <div>
    `;
  }
}

customElements.define('component-toast', ComponentToast);
