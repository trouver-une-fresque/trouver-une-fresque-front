import {LitElement, html, customElement, property, css } from 'lit-element';
import {Router, SlottedTemplateResultFactory} from "./routing/Router";
import smoothscroll from 'smoothscroll-polyfill';
import {CSS_Global} from "./styles/ConstructibleStyleSheets";
import {ServiceWorkers} from "./utils/ServiceWorkers";
import {RemoteConfig} from "./utils/RemoteConfig";

@customElement('tuf-app')
export class TufAppComponent extends LitElement {

    //language=css
    static styles = [
        CSS_Global,
        css`
            .appLogo {}
            .appLogo._phone {
                max-width: 25vw;
            }
        `
    ];

    @property({type: Object, attribute: false}) viewTemplateResult: SlottedTemplateResultFactory|undefined = undefined;

    constructor() {
        super();

        smoothscroll.polyfill();

        RemoteConfig.INSTANCE.sync();

        Router.installRoutes((viewTemplateResult) => {
            this.viewTemplateResult = viewTemplateResult;
        })

        ServiceWorkers.INSTANCE.startup();
    }

    render() {
        return html`
        <div class="app-wrapper">
            <div class="container">
                <div class="row align-items-center justify-content-between">
                    <a href="${Router.basePath}" class="col-auto">
                        <img src="${Router.basePath}assets/images/svg/tuf-logo-portrait.svg" class="d-block d-sm-none appLogo _phone" alt="Trouvez une fresque">
                        <img src="${Router.basePath}assets/images/svg/tuf-logo-landscape.svg" class="d-none d-sm-block appLogo" alt="Trouvez une fresque">
                    </a>
                    <div class="col">
                        <div class="row justify-content-end gx-5">
                            <div class="col-auto">
                                <a href="${Router.basePath}carte">Carte</a>
                            </div>
                            <div class="col-auto">
                                <a href="${Router.basePath}apropos">À propos</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="app-content">
            ${this.viewTemplateResult?this.viewTemplateResult(html`
              <slot name="main-title" slot="main-title"></slot>
              <slot name="about" slot="about"></slot>
              `):html``}
            </div>

            
            <footer>
                <div class="container-xxl">
                    <div class="disclaimer">
                        <p >Trouver une Fresque n'est pas un outil officiel, n'est PAS exhaustif et ne remplace pas une recherche manuelle notamment dans le cas où aucun atelier disponible n'est proposé sur notre site.</p>
                    </div>
                </div>
                <div class="row justify-content-between">
                    <div class="col-auto">
                        Trouver une Fresque -
                        <a href="https://github.com/trouver-une-fresque/trouver-une-fresque-front/blob/main/LICENSE">(CC BY-NC-SA 4.0)</a>
                    </div>
                    <div class="col-auto">
                        <div class="row">
                            <div class="col-auto">
                                <a href="${Router.basePath}mentions-legales">Mentions légales</a>
                            </div>
                            <div class="col-auto">
                                <a href="mailto:contact@trouverunefresque.org" rel="noreferrer">Contactez-nous</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
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
