import {css, customElement, html, LitElement, property } from 'lit-element';
import {Router} from "../routing/Router";
import {
    libelleUrlPathDeCommune,
    libelleUrlPathDuDepartement,
    SearchType,
    ATELIERS,
    SearchRequest,
    State,
    Departement, TYPE_RECHERCHE_PAR_DEFAUT,
} from "../state/State";
import {CSS_Global, CSS_Home} from "../styles/ConstructibleStyleSheets";

@customElement('tuf-home')
export class TufHomeView extends LitElement {

    //language=css
    static styles = [
        CSS_Global,
        CSS_Home,
        css`
            :host {
                display: block;
            }
        `
    ];

    @property({type: Array, attribute: false}) recuperationCommunesEnCours: boolean = false;

    private async onSearch (event: CustomEvent<SearchRequest>) {
      const searchType: SearchType = TYPE_RECHERCHE_PAR_DEFAUT;
      if (SearchRequest.isByDepartement(event.detail)) {
        const departement = event.detail.departement
        Router.navigateToRendezVousAvecDepartement(departement.code_departement, libelleUrlPathDuDepartement(departement), searchType, false)
      } else {
        const commune = event.detail.commune;
        const departements = await State.current.departementsDisponibles();
        const departement: Departement|undefined = departements.find(({ code_departement }) => code_departement === commune.codeDepartement);

        if (!departement) {
            console.error(`Can't find departement matching code ${commune.codeDepartement}`)
            return;
        }

        Router.navigateToRendezVousAvecCommune(
            'distance',
            departement.code_departement,
            libelleUrlPathDuDepartement(departement),
            commune.code,
            commune.codePostal,
            libelleUrlPathDeCommune(commune!),
            searchType,
            false
        );
      }
    }

    render() {
        return html`
            <div class="searchAppointment">
                <div class="searchAppointment-title h1">
                  <slot name="main-title"></slot>
                </div>

                <div class="searchAppointment-form">
                    <div class="searchAppointmentForm-fields">
                          <tuf-search
                            @on-search="${this.onSearch.bind(this)}"
                          />
                    </div>
                </div>
            </div>

            <div class="platforms mt-5">
                <div class="row">
                  ${Object.values(ATELIERS).filter(a => a.promoted).map(atelier => {
                      return html`
                        <div class="text-center col-md-8 col-sm-16">
                          <figure>
                            <a href="${atelier.website}" class="platforms-link">
                              <img class="platforms-logo" src="${Router.basePath}assets/images/logo/${atelier.logo}" alt="Ateliers ${atelier.nom}">
                            </a>
                            <figcaption>${atelier.nom}</figcaption>
                            <p>
                              ${atelier.description}
                            </p>
                          </figure>
                        </div>
                      `
                  })}
                </div>
            </div>

            <div class="spacer mt-5 mb-5"></div>

            <slot name="about"></slot>
        `;
    }

    async connectedCallback() {
        super.connectedCallback();
    }
}
