import { LitElement } from 'lit';

/** Base component */
export default class BaseElement extends LitElement {
  /**
   * Create an open shadow root and customize it.
   * @return {Element | ShadowRoot} render root
   */
  createRenderRoot() {
    const root = super.createRenderRoot();
    const styleList = ['mobile.css'];
    styleList.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = href;
      this.shadowRoot.prepend(link);
    });
    return root;
  }
}
