import {LitElement, html, customElement, css} from 'lit-element';
import {CSS_Global, CSS_Home} from "../styles/ConstructibleStyleSheets";

@customElement('tuf-mentions')
export class TufMentionsComponent extends LitElement {

    //language=css
    static styles = [
        CSS_Global,
        CSS_Home,
        css`
        `
    ];

    constructor() {
        super();
    }

    render() {
        return html`
            <div class="container">
                <h3>Mentions légales</h3>
                <p>Le présent site est édité par Thomas Bouvier et Timothé Frignac et hébergé par la société TODO</p>
                <p>Tous doits réservés</p>
                <br>
                <h4>Données personnelles</h4>
                <p>Votre adresse IP et la référence de la page visitée font partie des informations personnelles enregistrées sur le serveur qui héberge ce site.</p>
                <p>Ces données peuvent éventuellement servir à diagnostiquer un problème, mais elles ne seront jamais transmises à des tiers et elles sont supprimées automatiquement.</p>
                <p>Pour toute question concernant vos données personnelles, vous pouvez nous contacter à l'adresse suivante : TODO</p>
            </div>
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
