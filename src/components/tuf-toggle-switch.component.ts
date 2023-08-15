import {css, customElement, html, LitElement, property, unsafeCSS} from "lit-element";
import toggleSwitchCss from "./tuf-toggle-switch.component.scss";
import {CSS_Global} from "../styles/ConstructibleStyleSheets";

export type ValueStrCustomEvent<T extends string> = CustomEvent<{value: T}>;

export type Option = {
    code: string;
    libelle: string;
};

@customElement('tuf-toggle-switch')
export class TufToggleSwitchComponent extends LitElement {

    @property({ type: Boolean }) checked = false;

  //language=css
    static styles = [
        CSS_Global,
        css`${unsafeCSS(toggleSwitchCss)}`,
        css`
            :host {
                display: block;
            }
        `
    ];

    render() {
    return html`
      <div
        class="toggle ${this.checked ? 'checked' : ''}"
        @click=${this.toggleChecked}
      >
        <div class="slider" style=${this.checked ? 'transform: translateX(16px);' : ''}></div>
      </div>
    `;
  }

  toggleChecked() {
    this.checked = !this.checked;
  }
}
