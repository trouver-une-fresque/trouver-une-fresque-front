import {
    css,
    customElement,
    html,
    LitElement,
    property,
    unsafeCSS
} from 'lit-element';
import {classMap} from "lit-html/directives/class-map";
import {
    Workshop,
    Atelier,
    ATELIERS,
} from "../state/State";
import {Router} from "../routing/Router";
import appointmentCardCss from "./vmd-appointment-card.component.scss";
import {TemplateResult} from "lit-html";
import {CSS_Global} from "../styles/ConstructibleStyleSheets";

type WorkshopCliqueContext = {workshop: Workshop};
export type WorkshopCliqueCustomEvent = CustomEvent<WorkshopCliqueContext>;

@customElement('vmd-appointment-card')
export class VmdAppointmentCardComponent extends LitElement {

    //language=css
    static styles = [
        CSS_Global,
        css`${unsafeCSS(appointmentCardCss)}`,
        css`
        .col-logo {
            max-width: 125px;
            display: flex;
        }
        `
    ];

    @property({type: Object, attribute: false}) workshop!: Workshop;
    @property({type: String}) theme!: string;

    constructor() {
        super();
    }

    prendreRdv() {
        this.dispatchEvent(new CustomEvent<WorkshopCliqueContext>('prise-rdv-cliquee', {
            detail: { workshop: this.workshop }
        }));
    }

    verifierRdv() {
        this.dispatchEvent(new CustomEvent<WorkshopCliqueContext>('verification-rdv-cliquee', {
            detail: { workshop: this.workshop }
        }));
    }

    render() {
            const atelier: Atelier|undefined = ATELIERS[this.workshop.workshop_type];
            let distance: string|undefined;
            // if (this.workshop.distance && this.workshop.distance >= 10) {
            //   distance = this.workshop.distance.toFixed(0)
            // } else if (this.workshop.distance) {
            //   distance = this.workshop.distance.toFixed(1)
            // }

            // FIXME créer un type `SearchResultItem` ou un truc du genre, pour avoir une meilleure vue des cas possibles
            // Qu'un if-pit de 72 lignes de long et 190 colonnes de large xD
            let cardConfig: {
                cardLink:(content: TemplateResult) => TemplateResult,
                cardTitle: string,
                disabledBG: boolean,
                actions: TemplateResult|undefined
            };

                let specificCardConfig: { disabledBG: boolean, cardTitle: string, libelleBouton: string, typeBouton: 'btn-info'|'btn-primary', onclick: ()=>void };
                if(this.workshop.sold_out) {
                    specificCardConfig = {
                        disabledBG: true,
                        cardTitle: `Atelier ${atelier.nom} complet.`,
                        libelleBouton: 'Vérifier sur la page de l\'évènement',
                        typeBouton: 'btn-info',
                        onclick: () => this.verifierRdv()
                    };
                } else {
                    specificCardConfig = {
                        disabledBG: false,
                        cardTitle: `Atelier ${atelier.nom}`,
                        libelleBouton: 'Réserver une place',
                        typeBouton: 'btn-primary',
                        onclick: () => this.prendreRdv()
                    };
                }

                cardConfig = {
                    disabledBG: specificCardConfig.disabledBG,
                    cardTitle: specificCardConfig.cardTitle,
                    cardLink: (content) =>
                        html`<div>${content}</div>`,
                    actions: html`
                      <button type="button" @click="${() => { specificCardConfig.onclick(); } }"
                         class="btn btn-lg ${classMap({ 'btn-primary': specificCardConfig.typeBouton==='btn-primary', 'btn-info': specificCardConfig.typeBouton==='btn-info' })}">
                        ${specificCardConfig.libelleBouton}
                      </button>
                      <div class="row align-items-center justify-content-center mt-3 text-gray-700">
                        ${atelier.nom?html`
                        `:html``}
                      </div>
                    `
                };

            return cardConfig.cardLink(html`
            <div class="card rounded-3 mb-5  ${classMap({
              'bg-disabled': cardConfig.disabledBG,
              'search-standard': this.theme==='standard',
              'search-highlighted': this.theme==='highlighted'
                })}">
                <div class="card-body p-4">
                    <div class="row align-items-center ">
                        <div class="col col-logo">
                          ${atelier?html`
                          <img class="rdvPlatformLogo ${atelier.styleCode}" src="${Router.basePath}assets/images/logo/${atelier.logo}" alt="Créneau de vaccination ${atelier.nom}">
                          `:html``}
                        </div>
                        <div class="col">
                            <div class="col card-title h5">
                              ${cardConfig.cardTitle}
                              <small class="distance">${distance ? `- ${distance} km` : ''}</small>
                            </div>
                            <div class="row">
                              <vmd-appointment-metadata class="mb-2" widthType="full-width">
                                <div slot="content">
                                  <span class="fw-bold">${this.workshop.title}</span>
                                  <br/>
                                  <span class="text-description">${this.workshop.address}, ${this.workshop.city} (${this.workshop.department})</span>
                                </div>
                              </vmd-appointment-metadata>
                              <vmd-appointment-metadata class="mb-2" widthType="fit-to-content" icon="vmdicon-syringe" .displayed="${!!this.workshop.online}">
                                <span class="text-description" slot="content">${this.workshop.description}</span>
                              </vmd-appointment-metadata>
                            </div>
                        </div>

                        ${cardConfig.actions?html`
                        <div class="col-24 col-md-auto text-center mt-4 mt-md-0">
                          ${cardConfig.actions}
                        </div>
                        `:html``}
                    </div>
                </div>
            </div>
            `);
    }

}
