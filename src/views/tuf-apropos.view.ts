import {LitElement, html, customElement, css} from 'lit-element';

@customElement('tuf-apropos')
export class TufAproposComponent extends LitElement {

    //language=css
    static styles = [
        css`
        `
    ];

    constructor() {
        super();
    }

    render() {
        return html`
            <slot name="about"></slot>
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        // console.log("connected callback")
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // console.log("disconnected callback")
    }
}
