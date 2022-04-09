import { css, html } from 'lit';
import BaseElement from './base';
import { ERROR_CODE } from './constants';

/** Custom `component-input` component */
class ComponentInput extends BaseElement {
  static styles = css`
    .input-field {
      display: flex;
      align-items: center;
      padding: 2px 5px;
    }
    .input-field input,
    .input-field select {
      flex: 1;
    }
    input.error {
      border-color: var(--color-red);
    }
    .message {
      font-size: 0.8rem;
      text-align: right;
      padding-right: 8px;
    }
  `;

  static properties = {
    type: {
      type: String,
    },
    label: {
      type: String,
    },
    initvalue: {
      type: String,
    },
    maxlength: {
      type: String,
    },
    options: {
      type: Array,
    },
    required: {
      type: Boolean,
    },
    errorMessage: {
      type: Boolean,
      attribute: false,
    },
  };

  /**
   * Create a shadow DOM for <component-table>.
   */
  constructor() {
    super();
    this.type = 'text';
    this.label = '';
    this.initvalue = '';
    this.maxlength = '';
    this.options = [];
    this.required = false;
    this.errorMessage = '';
  }

  /**
   * Validate input value
   * @param {InputEvent} event - input event
   * @return {boolean} Valid or not
   */
  validate(event) {
    let value;
    if (event) {
      event.stopPropagation();
      value = event.target.value;
    } else {
      const inputfield = this.shadowRoot.getElementById('inputfield');
      value = inputfield.value;
    }
    value = value.trim();
    if (this.required && !value) {
      this.errorMessage =
        ERROR_CODE[this.type === 'number' ? 'NOT_A_NUMBER' : 'EMPTY'];
      return false;
    }

    // if (this.type === 'number' && isNaN(+value)) {
    //   this.errorMessage = ERROR_CODE.NOT_A_NUMBER;
    //   return false;
    // }

    if (this.maxlength && value.length > this.maxlength) {
      this.errorMessage = `${ERROR_CODE.MAX_LENGTH} ${this.maxlength}`;
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  /**
   * Check if the input type is valie
   * @return {boolean} Valid or not
   */
  get isValid() {
    return this.validate();
  }

  /**
   * Get the input value
   * @return {string|number} Input value
   */
  get value() {
    const value = this.shadowRoot.getElementById('inputfield').value;
    return this.type === 'number' ? +value : value.trim();
  }

  /**
   * To define a template for `component-input`
   * @return {TemplateResult} template result
   */
  render() {
    return html`
      <div class="input-field" @input="${this.validate}">
        ${this.label ?
          html`
            <label ?required="${this.required}" for="inputfield">
              ${this.label}
            </label>
          ` :
          null
        }
        ${this.type === 'select' && this.options.length ?
          html`
            <select id="inputfield">
              ${this.options.map(({ value, name }) => html`
                <option
                  value="${value}"
                  .selected="${value === this.initvalue}"
                >
                  ${name}
                </option>
              `)}
            </select>
          ` :
          html`
            <input
              id="inputfield"
              type="${this.type}"
              value="${this.initvalue}"
              maxlength="${this.maxlength}"
              class="${this.errorMessage ? 'error' : ''}"
            >
          `
        }
      </div>

      ${this.errorMessage ?
        html`<div class="message error">${this.errorMessage}</div>` :
        null
      }
    `;
  }
}

customElements.define('component-input', ComponentInput);
