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
                <p>Le présent site est édité par <a href="https://github.com/thomas-bouvier">Thomas Bouvier</a> et <a href="https://github.com/TimotF">Timothé Frignac</a> et hébergé par la société Hostinger, dont le siège social est situé HOSTINGER INTERNATIONAL LTD, 61 Lordou Vironos Street, 6023 Larnaca, Chypre, joignable par le moyen suivant : <a href="https://www.hostinger.fr/contact">https://www.hostinger.fr/contact</a>.</p>
                <p>Tous doits réservés</p>
                <br>
                <h4>Données personnelles</h4>
                <p>Votre adresse IP et la référence de la page visitée font partie des informations personnelles enregistrées sur le serveur qui héberge ce site.</p>
                <p>Ces données peuvent éventuellement servir à diagnostiquer un problème, mais elles ne seront jamais transmises à des tiers et elles sont supprimées automatiquement.</p>
                <p>Pour toute question concernant vos données personnelles, vous pouvez nous contacter à l'adresse suivante : contact@trouverunefresque.org </p>
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
