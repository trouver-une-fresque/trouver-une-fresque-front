import {
    css,
    customElement,
    html,
    internalProperty,
    LitElement,
    property,
    PropertyValues,
    unsafeCSS
} from 'lit-element';
import {repeat} from "lit-html/directives/repeat";
import {styleMap} from "lit-html/directives/style-map";
import {Router} from "../routing/Router";
import rdvViewCss from "./tuf-workshop.view.scss";
import distanceEntreDeuxPoints from "../distance"
import {
    CodeDepartement,
    Commune,
    libelleUrlPathDeCommune,
    libelleUrlPathDuDepartement,
    Workshop,
    WorkshopsAvecDistanceParDepartement,
    WorkshopsAffichableAvecDistance,
    SearchRequest,
    SearchType,
    State,
    CodeTriCentre,
    searchTypeConfigFromSearch,
    TYPE_RECHERCHE_PAR_DEFAUT, WorkshopsParDepartement
} from "../state/State";
import {formatDistanceToNow, parseISO} from 'date-fns'
import { fr } from 'date-fns/locale'
import {Strings} from "../utils/Strings";
import {DEPARTEMENTS_LIMITROPHES} from "../utils/Departements";
import {TemplateResult} from "lit-html";
import {WorkshopCliqueCustomEvent} from "../components/tuf-workshop-card.component";
import {delay} from "../utils/Schedulers";
import {ArrayBuilder} from "../utils/Arrays";
import {CSS_Global} from "../styles/ConstructibleStyleSheets";
import {InfiniteScroll} from "../state/InfiniteScroll";
import {DisclaimerSeverity} from "../utils/RemoteConfig";

export abstract class AbstractTufRdvView extends LitElement {
    DELAI_VERIFICATION_MISE_A_JOUR = 45000
    DELAI_VERIFICATION_SCROLL = 1000;
    SCROLL_OFFSET = 200;

    //language=css
    static styles = [
        CSS_Global,
        css`${unsafeCSS(rdvViewCss)}`,
        css`
          input[type=time] {
            line-height: 20px;
            width: 80px;
            font-size: 1.6rem;
          }

          .time-range {
            width: auto;
            display: inline-block;
            background-color: white;
            padding: 6px;
            border: 1px solid grey;
          }

          /* see https://css-tricks.com/value-bubbles-for-range-inputs/ */
          .range-wrap {
            position: relative;
            margin: 3rem auto 3rem;
          }
          .bubble {
            background: #5561d9;
            color: white;
            padding: 4px 12px;
            position: absolute;
            border-radius: 4px;
            left: 50%;
            top: 40px;
            transform: translateX(-50%);
          }
          .bubble::after {
            content: "";
            position: absolute;
            width: 2px;
            height: 2px;
            background: #5561d9;
            top: -1px;
            left: 50%;
          }
          
          /* see https://www.cssportal.com/style-input-range/ */
          input[type=range] {
            height: 26px;
            background-color: transparent;
            -webkit-appearance: none;
            margin: 10px 0;
            width: 100%;
          }
          input[type=range]:focus {
            outline: none;
          }
          input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 14px;
            cursor: pointer;
            animate: 0.2s;
            box-shadow: 1px 1px 1px #5561d9;
            background: #5561d9;
            border-radius: 14px;
            border: 0px solid #000000;
          }
          input[type=range]::-webkit-slider-thumb {
            box-shadow: 0px 0px 0px #000000;
            border: 0px solid #000000;
            height: 20px;
            width: 40px;
            border-radius: 12px;
            background: white;
            cursor: pointer;
            -webkit-appearance: none;
            margin-top: -3px;
          }
          input[type=range]:focus::-webkit-slider-runnable-track {
            background: #5561d9;
          }
          input[type=range]::-moz-range-track {
            width: 100%;
            height: 14px;
            cursor: pointer;
            animate: 0.2s;
            box-shadow: 1px 1px 1px #5561d9;
            background: #5561d9;
            border-radius: 14px;
            border: 0px solid #000000;
          }
          input[type=range]::-moz-range-thumb {
            box-shadow: 0px 0px 0px #000000;
            border: 0px solid #000000;
            height: 20px;
            width: 40px;
            border-radius: 12px;
            background: white;
            cursor: pointer;
          }
          input[type=range]::-ms-track {
            width: 100%;
            height: 14px;
            cursor: pointer;
            animate: 0.2s;
            background: transparent;
            border-color: transparent;
            color: transparent;
          }
          input[type=range]::-ms-fill-lower {
            background: #5561d9;
            border: 0px solid #000000;
            border-radius: 28px;
            box-shadow: 1px 1px 1px #5561d9;
          }
          input[type=range]::-ms-fill-upper {
            background: #5561d9;
            border: 0px solid #000000;
            border-radius: 28px;
            box-shadow: 1px 1px 1px #5561d9;
          }
          input[type=range]::-ms-thumb {
            margin-top: 1px;
            box-shadow: 0px 0px 0px #000000;
            border: 0px solid #000000;
            height: 20px;
            width: 40px;
            border-radius: 12px;
            background: white;
            cursor: pointer;
          }
          input[type=range]:focus::-ms-fill-lower {
            background: #5561d9;
          }
          input[type=range]:focus::-ms-fill-upper {
            background: #5561d9;
          }
        `
    ];

    @internalProperty() workshopsParDepartementAffiches: WorkshopsAvecDistanceParDepartement | undefined = undefined;
    @property({type: Boolean, attribute: false}) searchInProgress: boolean = false;
    @property({type: Boolean, attribute: false}) miseAJourDisponible: boolean = false;
    @property({type: Array, attribute: false}) cartesAffichees: Workshop[] = [];
    @internalProperty() workshopsParDepartement: WorkshopsParDepartement|undefined = undefined;
    @internalProperty() protected currentSearch: SearchRequest | undefined = undefined

    @internalProperty() disclaimerEnabled: boolean = false;
    @internalProperty() disclaimerMessage: string | undefined = undefined;
    @internalProperty() disclaimerSeverity: DisclaimerSeverity | undefined = undefined;

    protected derniereCommuneSelectionnee: Commune|undefined = undefined;

    private infiniteScroll = new InfiniteScroll();
    private infiniteScrollObserver: IntersectionObserver | undefined;

    constructor(private options: {
        codeDepartementAdditionnels: (codeDepartementSelectionne: CodeDepartement) => CodeDepartement[],
        criteresDeRechercheAdditionnels: () => TemplateResult
    }) {
        super();
    }

    get searchTypeConfig() {
        return searchTypeConfigFromSearch(this.currentSearch, TYPE_RECHERCHE_PAR_DEFAUT)
    }

    async onSearchSelected (event: CustomEvent<SearchRequest>) {
      const search = event.detail
      this.goToNewSearch(search)
    }

    protected async goToNewSearch (search: SearchRequest) {
      if (SearchRequest.isByDepartement(search)) {
        Router.navigateToRendezVousAvecDepartement(search.departement.code_departement, libelleUrlPathDuDepartement(search.departement), search.type, search.online);
      } else {
        const departements = await State.current.departementsDisponibles()
        const departement = departements.find(d => d.code_departement === search.commune.codeDepartement);
        const commune = search.commune
        Router.navigateToRendezVousAvecCommune(search.tri, commune.codeDepartement,
          libelleUrlPathDuDepartement(departement!), commune.code, commune.codePostal, libelleUrlPathDeCommune(commune), search.type, search.online);
      }
    }



    render() {
        const countWorkshopsDisponibles = (this.workshopsParDepartementAffiches?.workshopsDisponibles || []).length;
        const searchTypeConfig = this.searchTypeConfig;

        return html`
            <div class="criteria-container text-dark rounded-3 py-5 bg-std">
              <div class="rdvForm-fields row align-items-center mb-3 mb-md-4">
                    <tuf-search
                          .value="${this.currentSearch}"
                          @on-search="${this.onSearchSelected}"
                    />
              </div>
              ${this.options.criteresDeRechercheAdditionnels()}
              ${true?html`
              <div class="rdvForm-fields row align-items-center mb-3 mb-md-4">
                <label for="searchAppointment-heures" class="col-sm-24 col-md-auto mb-md-1 label-for-search p-3 ps-1">
                  Inclure les ateliers en ligne :
                </label>
                <div class="col">
                  <tuf-toggle-switch class=""
                                     codeSelectionne="no"
                                     .checked="${this.currentSearch?.online || false}"
                                     @changed="${(e: CustomEvent<{value: boolean}>) => this.updateResultsWithOnline(e.detail.value)}">
                  </tuf-toggle-switch>
                </div>
              </div>`:html``}
                <div class="rdvForm-fields row align-items-center mb-3 mb-md-4">
                    <label class="col-sm-24 col-md-auto mb-md-1 label-for-search p-3 ps-1">
                        Vous souhaitez :
                    </label>
                    <div class="col">
                        <tuf-button-switch class="mb-3" style="display: inline-block"
                                           codeSelectionne="${this.currentSearch?.type || 'atelier'}"
                                           .options="${[{code: 'atelier', libelle: 'participer à un atelier'}, {code: 'formation', libelle: 'se former à l\'animation'}, {code: 'junior', libelle: 'trouver un atelier pour un junior'}]}"
                                           @changed="${(e: CustomEvent<{value: SearchType}>) => this.updateSearchTypeTo(e.detail.value)}">
                        </tuf-button-switch>
                    </div>
                </div>
            </div>

            <div class="spacer mt-5 mb-5"></div>
            
            ${this.searchInProgress?html`
              <div class="d-flex justify-content-center">
                <div class="spinner-border text-primary" style="height: 50px; width: 50px" role="status">
                </div>
              </div>
            `:html`
                <h3 class="fw-normal text-center h4 search-standard"
                    style="${styleMap({display: (this.workshopsParDepartementAffiches) ? 'block' : 'none'})}">
                    ${countWorkshopsDisponibles?
                      
                      html`
                    <i class="bi vmdicon-calendar2-check-fill text-success me-2 fs-3 col-auto"></i>
                    <span class="col col-sm-auto">
                    ${countWorkshopsDisponibles.toLocaleString()} ${searchTypeConfig.type=="junior"?"atelier":searchTypeConfig.type}${Strings.plural(countWorkshopsDisponibles, "s")} trouvé${Strings.plural(countWorkshopsDisponibles)}
                    ${this.libelleLieuSelectionne()}
                    </span>`
                    
                    :html`
                      <i class="bi vmdicon-calendar-x-fill text-black-50 me-2 fs-3 col-auto"></i>
                    <span class="col col-sm-auto">
                    ${countWorkshopsDisponibles.toLocaleString()} ${searchTypeConfig.type=="junior"?"atelier":searchTypeConfig.type}${Strings.plural(countWorkshopsDisponibles, "s")} recensé${Strings.plural(countWorkshopsDisponibles)}
                    sur notre plateforme${this.libelleLieuSelectionne()}
                    `
                    }
                  <br/>
                  ${(this.workshopsParDepartementAffiches && this.workshopsParDepartementAffiches.derniereMiseAJour) ?
                      html`
                      <p class="fs-6 text-gray-600">
                        Dernière mise à jour : il y a
                        ${ formatDistanceToNow(parseISO(this.workshopsParDepartementAffiches!.derniereMiseAJour), { locale: fr }) }
                      </p>
                      <p class="alert ${this.disclaimerSeverity === 'error' ? 'alert-danger':'alert-warning'} fs-6 ${this.disclaimerEnabled ? '' : 'd-none'}">
                          <i class="bi vmdicon-attention-fill"></i>
                          ${this.disclaimerMessage}
                      </p>
                        `
                        : html``}
                  </h3>

                <div class="spacer mt-5 mb-5"></div>


                ${countWorkshopsDisponibles?
                  
                  html`
                <div class="resultats px-2 py-5 text-dark bg-light rounded-resultats-top">
                  <div id="scroller">
                      ${repeat(this.cartesAffichees || [],
                                  (c => `${c.department}||${c.title}||${c.workshop_type}}`), 
                                  (workshop, index) => {
                                    return html`<tuf-workshop-card
                              style="--list-index: ${index}"
                              .workshop="${workshop}"
                              theme="${searchTypeConfig.theme}"
                              @prise-rdv-cliquee="${(event: WorkshopCliqueCustomEvent) => this.prendreRdv(event.detail.workshop)}"
                              @verification-rdv-cliquee="${(event: WorkshopCliqueCustomEvent) =>  this.verifierRdv(event.detail.workshop)}"
                          />`;
                      })}
                      <div id="sentinel"></div>
                  </div>
                </div>`
                
                :
                this.currentSearch?.online == false?
                html`
                <div class="resultats px-2 py-5 text-dark bg-light rounded-resultats-top">
                  <div id="scroller">
                      <div class="card rounded-3 mb-5 search-standard">
                          <div class="card-body p-4">
                              <div class="row align-items-center ">
                                  <div class="col">
                                      <div class="col card-title h5 text-center">
                                        Souhaitez vous inclure les ateliers en ligne?
                                      </div>
                                  </div>

                                  <div class="col-24 col-md-auto text-center mt-4 mt-md-0">
                                    <button type="button" @click="${() => { this.updateResultsWithOnline(true); } }"
                                      class="btn btn-lg btn-primary">
                                      Voir les ateliers en ligne
                                    </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div id="sentinel"></div>
                  </div>
                </div>`
                :html``
                }
                
            `}
        `;
    }

    updated(changedProperties: PropertyValues) {
        super.updated(changedProperties);
        this.registerInfiniteScroll();
    }

    async connectedCallback() {
        super.connectedCallback();
    }

    private registerInfiniteScroll() {
        if (!this.shadowRoot) {
            return;
        }

        const scroller = this.shadowRoot.querySelector('#scroller');
        const sentinel = this.shadowRoot.querySelector('#sentinel');

        if (!scroller || !sentinel) {
            return;
        }

        if (this.infiniteScrollObserver) {
            this.infiniteScrollObserver.disconnect();
        }
        this.infiniteScrollObserver = new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                this.cartesAffichees = this.infiniteScroll.ajouterCartesPaginees(this.workshopsParDepartementAffiches,
                    this.cartesAffichees);
            }
        }, { root: null, rootMargin: '200px', threshold: 0.0 });
        if (sentinel) {
            this.infiniteScrollObserver.observe(sentinel);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopListeningToScroll();
    }

    private stopListeningToScroll() {
        if (this.infiniteScrollObserver) {
            this.infiniteScrollObserver.disconnect();
        }
    }

    async refreshWorkshops() {
        const currentSearch = this.currentSearch
        if(currentSearch) {

            // const codeDepartement = SearchRequest.isByDepartement(currentSearch)
            //   ? currentSearch.departement.code_departement
            //   : currentSearch.commune.codeDepartement
            try {   
                this.searchInProgress = true;
                await delay(1) // give some time (one tick) to render loader before doing the heavy lifting
                this.workshopsParDepartement = await State.current.allWorkshops();
                // this.workshopsParDepartement = await State.current.workshopsPour([codeDepartement].concat(this.options.codeDepartementAdditionnels(codeDepartement)));
                if(this.currentSearch?.type === 'junior') {
                    this.workshopsParDepartement.workshopsDisponibles = this.workshopsParDepartement.workshopsDisponibles.filter(w => w.kids && !w.training);
                }else if(this.currentSearch?.type === 'formation') {
                    this.workshopsParDepartement.workshopsDisponibles = this.workshopsParDepartement.workshopsDisponibles.filter(w => w.training);
                  }else if(this.currentSearch?.type === 'atelier') {
                  this.workshopsParDepartement.workshopsDisponibles = this.workshopsParDepartement.workshopsDisponibles.filter(w => !w.training);
                }

                // filter online workshops if needed
                if(this.currentSearch?.online === false) {
                  this.workshopsParDepartement.workshopsDisponibles = this.workshopsParDepartement.workshopsDisponibles.filter(w => !w.online);
                }

                this.rafraichirDonneesAffichees();
            } finally {
                this.searchInProgress = false;
            }
        } else {
            this.cartesAffichees = [];
        }
    }


    rafraichirDonneesAffichees() {

        if(this.currentSearch && this.workshopsParDepartement) {
            // const searchTypeConfig = searchTypeConfigFor(this.currentSearch.type);
            const workshopsMatchantCriteres = this.filtrerWorkshopsMatchantLesCriteres(this.workshopsParDepartement, this.currentSearch);
            // const workshopsMatchantCriteres = this.workshopsParDepartement;

            this.workshopsParDepartementAffiches = {
                derniereMiseAJour: this.workshopsParDepartement.derniereMiseAJour,
                codeDepartements: this.workshopsParDepartement.codeDepartements,
                workshopsMatchantCriteres: workshopsMatchantCriteres,
                workshopsDisponibles: workshopsMatchantCriteres,
            };

            this.cartesAffichees = this.infiniteScroll.ajouterCartesPaginees(this.workshopsParDepartementAffiches, []);
        }
    }


    private prendreRdv(workshop: Workshop) {
        Router.navigateToUrlIfPossible(workshop.source_link);
      }
      
      private verifierRdv(workshop: Workshop) {
        Router.navigateToUrlIfPossible(workshop.source_link);
    }

    // private currentTri(): CodeTriCentre|"unknown" {
    //   return this.currentSearch?this.currentSearch.tri:'unknown';
    // }

    // FIXME move me to testable files
    protected extraireFormuleDeTri(workshop: WorkshopsAffichableAvecDistance, tri: CodeTriCentre) {
        if(tri === 'date') {
            return `${Strings.padLeft(Date.parse(workshop.start_date!) || 0, 15, '0')}`;
        } else if(tri === 'distance') {
            return `${Strings.padLeft(Math.round(workshop.distance!*1000), 8, '0')}`;
        } else {
          throw new Error(`Unsupported tri : ${tri}`);
        }
    }

    protected updateSearchTypeTo(searchType: SearchType) {
        if(this.currentSearch) {
          this.goToNewSearch({
            ...this.currentSearch, type: searchType
          });
        }
    }

    protected updateResultsWithOnline(includeOnline: boolean) {
        if(this.currentSearch) {
          this.goToNewSearch({
            ...this.currentSearch, online: includeOnline
          });
        }
    }

    abstract libelleLieuSelectionne(): TemplateResult;
    // FIXME move me to a testable file
    abstract filtrerWorkshopsMatchantLesCriteres(workshopsParDepartement: WorkshopsParDepartement, search: SearchRequest): WorkshopsAffichableAvecDistance[];
}

@customElement('tuf-workshop-par-commune')
export class TufRdvParCommuneView extends AbstractTufRdvView {
    @internalProperty() protected currentSearch: SearchRequest.ByCommune | undefined = undefined
    @property({type: String}) set searchType(type: SearchType) {
      this._searchType = type
      this.updateCurrentSearch()
    }
    @property({type: String}) set codeCommuneSelectionne(code: string) {
      this._codeCommuneSelectionne = code
      this.updateCurrentSearch()
    }
    @property({type: String}) set codePostalSelectionne (code: string) {
      this._codePostalSelectionne = code
      this.updateCurrentSearch()
    }
    @property({type: String})
    set onlineEventsSelectionne (online: String) {
      this._onlineEvents = online == "oui";
      this.updateCurrentSearch()
    }
    @internalProperty() private _onlineEvents: boolean = false
    @internalProperty() private _searchType: SearchType | undefined = undefined;
    @internalProperty() private _codeCommuneSelectionne: string | undefined = undefined;
    @internalProperty() private _codePostalSelectionne: string | undefined = undefined;
    @internalProperty() private _distanceSelectionnee: number = 50;

    private currentSearchMarker = {}

    constructor() {
        super({
          codeDepartementAdditionnels: (codeDepartementSelectionne) => DEPARTEMENTS_LIMITROPHES[codeDepartementSelectionne],
            criteresDeRechercheAdditionnels: () => html`
            <div class="rdvForm-fields row align-items-center mb-3 mb-md-4">
            <label for="searchAppointment-distance" class="col-sm-24 col-md-auto mb-md-1 label-for-search p-3 ps-1">
            Distance :
            </label>
            <div class="px-0 col">
              <tuf-input-range-with-tooltip
                  id="searchAppointment-distance" codeSelectionne="${this._distanceSelectionnee}"
                  theme="${this.searchTypeConfig.theme}"
                  .options="${[
                    {code: 5, libelle:"<5km"}, {code: 10, libelle:"<10km"},
                    {code: 25, libelle:"<25km"}, {code: 50, libelle:"<50km"},
                    {code: 100, libelle:"<100km"}, {code: 250, libelle:"<250km"},
                    {code: 500, libelle:"<500km"}, {code: 100000, libelle:"∞"}
                  ]}"
                  @option-selected="${(e: CustomEvent<{value: number}>) => { this._distanceSelectionnee = e.detail.value; this.rafraichirDonneesAffichees(); }}"
              ></tuf-input-range-with-tooltip>
            </div>
          </div>
            `
        });
    }

    private async updateCurrentSearch() {
      if (this._codeCommuneSelectionne && this._codePostalSelectionne && this._searchType) {
        const marker = {}
        this.currentSearchMarker = marker
        await delay(20)
        if (this.currentSearchMarker !== marker) { return }
        const commune = await State.current.autocomplete.findCommune(this._codePostalSelectionne, this._codeCommuneSelectionne)
        if (commune) {
          this.currentSearch = SearchRequest.ByCommune(commune, this._searchType, this._onlineEvents)
          this.refreshWorkshops()
        }
      }
    }

    libelleLieuSelectionne(): TemplateResult {
        let nom = '???';
        if (this.currentSearch) {
          const commune = this.currentSearch.commune
          nom = `${commune.nom} (${commune.codePostal})`
        }
        return html`
          autour de
          <span class="fw-bold">${nom}${this._onlineEvents?' ou En Ligne':''}</span>
        `
    }

    filtrerWorkshopsMatchantLesCriteres(workshopsParDepartement: WorkshopsParDepartement, search: SearchRequest.ByCommune): WorkshopsAffichableAvecDistance[] {
        const origin = search.commune
        const distanceAvec = (workshop: Workshop) => (workshop.online ? 0 : distanceEntreDeuxPoints(origin, {latitude: workshop.latitude, longitude: workshop.longitude}))

        let workshopsAffichablesBuilder = ArrayBuilder.from([...workshopsParDepartement.workshopsDisponibles])
            .map(l => ({ ...l, distance: distanceAvec(l) }));

        workshopsAffichablesBuilder = workshopsAffichablesBuilder.filter(l => l.distance <= this._distanceSelectionnee)

        workshopsAffichablesBuilder.sortBy(l => this.extraireFormuleDeTri(l, 'date'))
        // workshopsAffichablesBuilder.sortBy(l => this.extraireFormuleDeTri(l, 'distance'))

        const workshopsMatchantCriteres = workshopsAffichablesBuilder.build();
        return workshopsMatchantCriteres;
    }
}

@customElement('tuf-workshop-par-departement')
export class TufRdvParDepartementView extends AbstractTufRdvView {
    @property({type: String})
    set searchType (type: SearchType) {
      this._searchType = type
      this.updateCurrentSearch()
    }
    @property({type: String})
    set codeDepartementSelectionne (code: CodeDepartement) {
      this._codeDepartement = code
      this.updateCurrentSearch()
    }
    @property({type: String})
    set onlineEventsSelectionne (online: String) {
      this._onlineEvents = online == "oui";
      this.updateCurrentSearch()
    }
    @internalProperty() private _onlineEvents: boolean = false
    @internalProperty() private _searchType: SearchType | void = undefined
    @internalProperty() private _codeDepartement: CodeDepartement | void = undefined
    @internalProperty() protected currentSearch: SearchRequest.ByDepartement | undefined = undefined

    constructor() {
        super({
            codeDepartementAdditionnels: () => [],
            criteresDeRechercheAdditionnels: () => html``
        });
    }

    private async updateCurrentSearch() {
        const code = this._codeDepartement
        if (code && this._searchType) {
          const departements = await State.current.departementsDisponibles()
          const departementSelectionne = departements.find(d => d.code_departement === code);
          if (departementSelectionne) {
            this.currentSearch = SearchRequest.ByDepartement(departementSelectionne, this._searchType, this._onlineEvents)
            this.refreshWorkshops()
          }
        }
    }

    libelleLieuSelectionne(): TemplateResult {
        let nom = '???'
        if (this.currentSearch) {
          const departement = this.currentSearch.departement
          nom = `${departement.nom_departement} (${departement.code_departement})`
        }
        return html`
          pour
          <span class="fw-bold">${nom}${this._onlineEvents?' ou En Ligne':''}</span>
        `
    }

    // FIXME move me to testable file
    filtrerWorkshopsMatchantLesCriteres(workshopsParDepartement: WorkshopsParDepartement /*, search: SearchRequest */): WorkshopsAffichableAvecDistance[] {

        let workshopsAffichablesBuilder = ArrayBuilder.from([...workshopsParDepartement.workshopsDisponibles])
            .map(l => ({ ...l, distance: undefined }))
            .filter(l => l.online || l.department === this._codeDepartement)

        workshopsAffichablesBuilder.sortBy(l => this.extraireFormuleDeTri(l, 'date'))
        // workshopsAffichablesBuilder.sortBy(l => this.extraireFormuleDeTri(l, 'distance'))

        const workshopsMatchantCriteres = workshopsAffichablesBuilder.build();
        return workshopsMatchantCriteres;
    }
}
