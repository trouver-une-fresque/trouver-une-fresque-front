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
import rdvViewCss from "./vmd-rdv.view.scss";
import distanceEntreDeuxPoints from "../distance"
import {
    CodeDepartement,
    Commune,
    libelleUrlPathDeCommune,
    libelleUrlPathDuDepartement,
    Lieu,
    LieuAffichableAvecDistance,
    LieuxAvecDistanceParDepartement,
    LieuxParDepartement,
    Workshop,
    WorkshopsAvecDistanceParDepartement,
    WorkshopsAffichableAvecDistance,
    SearchRequest,
    SearchType,
    State,
    CodeTriCentre,
    searchTypeConfigFor,
    searchTypeConfigFromSearch,
    SearchTypeConfig,
    RendezVousDuJour,
    StatsCreneauxLieuxParJour,
    countCreneauxFromCreneauxParTag, TYPE_RECHERCHE_PAR_DEFAUT, WorkshopsParDepartement
} from "../state/State";
import {formatDistanceToNow, parseISO} from 'date-fns'
import { fr } from 'date-fns/locale'
import {Strings} from "../utils/Strings";
import {DEPARTEMENTS_LIMITROPHES} from "../utils/Departements";
import {TemplateResult} from "lit-html";
import {Analytics} from "../utils/Analytics";
import {WorkshopCliqueCustomEvent} from "../components/vmd-appointment-card.component";
import {delay, setDebouncedInterval} from "../utils/Schedulers";
import {ArrayBuilder} from "../utils/Arrays";
import {classMap} from "lit-html/directives/class-map";
import {CSS_Global} from "../styles/ConstructibleStyleSheets";
import {InfiniteScroll} from "../state/InfiniteScroll";
import {DisclaimerSeverity, RemoteConfig} from "../utils/RemoteConfig";

export abstract class AbstractVmdRdvView extends LitElement {
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

    @internalProperty() lieuxParDepartementAffiches: LieuxAvecDistanceParDepartement | undefined = undefined;
    @internalProperty() workshopsParDepartementAffiches: WorkshopsAvecDistanceParDepartement | undefined = undefined;
    @internalProperty() creneauxQuotidiensAffiches: RendezVousDuJour[] = [];
    @property({type: Boolean, attribute: false}) searchInProgress: boolean = false;
    @property({type: Boolean, attribute: false}) miseAJourDisponible: boolean = false;
    @property({type: Array, attribute: false}) cartesAffichees: Workshop[] = [];
    @internalProperty() lieuxParDepartement: LieuxParDepartement|undefined = undefined;
    @internalProperty() workshopsParDepartement: WorkshopsParDepartement|undefined = undefined;
    @internalProperty() protected currentSearch: SearchRequest | undefined = undefined

    @internalProperty() jourSelectionne: {date: string, type: 'manual'|'auto'}|undefined = undefined;

    @internalProperty() disclaimerEnabled: boolean = false;
    @internalProperty() disclaimerMessage: string | undefined = undefined;
    @internalProperty() disclaimerSeverity: DisclaimerSeverity | undefined = undefined;

    protected derniereCommuneSelectionnee: Commune|undefined = undefined;

    protected lieuBackgroundRefreshIntervalId: ReturnType<typeof setTimeout>|undefined = undefined;
    private infiniteScroll = new InfiniteScroll();
    private infiniteScrollObserver: IntersectionObserver | undefined;

    constructor(private options: {
        codeDepartementAdditionnels: (codeDepartementSelectionne: CodeDepartement) => CodeDepartement[],
        criteresDeRechercheAdditionnels: () => TemplateResult
    }) {
        super();
    }

    get totalCreneaux() {
        if (!this.creneauxQuotidiensAffiches) {
            return 0;
        }
        return this.creneauxQuotidiensAffiches
            .reduce((total, rdvDuJour) => total+rdvDuJour.total, 0);
    }

    get daySelectorAvailable(): boolean {
        return !!this.lieuxParDepartement?.statsCreneauxLieuxQuotidiens.length && !!this.currentSearch && searchTypeConfigFor(this.currentSearch.type).jourSelectionnable;
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
        const standardMode = searchTypeConfig.standardTabSelected;

        return html`
            <div class="criteria-container text-dark rounded-3 py-5 bg-std">
              <div class="rdvForm-fields row align-items-center mb-3 mb-md-4">
                    <vmd-search
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
                        <vmd-button-switch class="mb-3" style="display: inline-block"
                                           codeSelectionne="${this.currentSearch?.type || 'atelier'}"
                                           .options="${[{code: 'atelier', libelle: 'participer à un atelier'}, {code: 'formation', libelle: 'se former à l\'animation'}, {code: 'junior', libelle: 'trouver un atelier pour un junior'}]}"
                                           @changed="${(e: CustomEvent<{value: SearchType}>) => this.updateSearchTypeTo(e.detail.value)}">
                        </vmd-button-switch>
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
                    </span>`:
                      html`
                      <i class="bi vmdicon-calendar-x-fill text-black-50 me-2 fs-3 col-auto"></i>
                    <span class="col col-sm-auto">
                    ${countWorkshopsDisponibles.toLocaleString()} ${searchTypeConfig.type=="junior"?"atelier":searchTypeConfig.type}${Strings.plural(countWorkshopsDisponibles, "s")} trouvé${Strings.plural(countWorkshopsDisponibles)}
                    ${this.libelleLieuSelectionne()}
                    `}
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

                ${this.daySelectorAvailable?html`
                  <div class="resultats px-4 py-3 text-dark bg-light rounded-resultats-top mb-2">
                      <vmd-upcoming-days-selector
                            dateSelectionnee="${this.jourSelectionne?.date || ""}"
                            .creneauxQuotidiens="${this.creneauxQuotidiensAffiches}"
                            @jour-selectionne="${(event: CustomEvent<RendezVousDuJour>) => {
                        this.jourSelectionne = { date: event.detail.date, type: 'manual' };
                        Analytics.INSTANCE.clickSurJourRdv(this.jourSelectionne.date, this.jourSelectionne.type, event.detail.total);
                        this.rafraichirDonneesAffichees();
                    }}"></vmd-upcoming-days-selector>
                  </div>
                `:html``}

                ${countWorkshopsDisponibles?html`
                <div class="resultats px-2 py-5 text-dark bg-light ${classMap({ 'rounded-resultats-top': !this.daySelectorAvailable })}">
                  <div id="scroller">
                      ${repeat(this.cartesAffichees || [],
                                  (c => `${c.department}||${c.title}||${c.workshop_type}}`), 
                                  (workshop, index) => {
                                    return html`<vmd-appointment-card
                              style="--list-index: ${index}"
                              .workshop="${workshop}"
                              theme="${searchTypeConfig.theme}"
                              @prise-rdv-cliquee="${(event: WorkshopCliqueCustomEvent) => this.prendreRdv(event.detail.workshop)}"
                              @verification-rdv-cliquee="${(event: WorkshopCliqueCustomEvent) =>  this.verifierRdv(event.detail.workshop)}"
                          />`;
                      })}
                      <div id="sentinel"></div>
                  </div>
                </div>`:html``}
                
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
        this.stopCheckingUpdates();
        this.stopListeningToScroll();
    }

    stopCheckingUpdates() {
        if(this.lieuBackgroundRefreshIntervalId) {
            clearInterval(this.lieuBackgroundRefreshIntervalId);
            this.lieuBackgroundRefreshIntervalId = undefined;
        }
    }

    private stopListeningToScroll() {
        if (this.infiniteScrollObserver) {
            this.infiniteScrollObserver.disconnect();
        }
    }

    async refreshWorkshops() {
        const currentSearch = this.currentSearch
        if(currentSearch) {

            const codeDepartement = SearchRequest.isByDepartement(currentSearch)
              ? currentSearch.departement.code_departement
              : currentSearch.commune.codeDepartement
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
                  console.log("filtering online workshops");
                  this.workshopsParDepartement.workshopsDisponibles = this.workshopsParDepartement.workshopsDisponibles.filter(w => !w.online);
                }else{
                  console.log("including online workshops")
                }

                console.log("refresh %d workshops", this.workshopsParDepartement.workshopsDisponibles.length);

                this.rafraichirDonneesAffichees();
            } finally {
                this.searchInProgress = false;
            }
        } else {
            this.cartesAffichees = [];
        }
        this.disclaimerEnabled = await RemoteConfig.INSTANCE.disclaimerEnabled();
        // Refresh only if needed
        if (this.disclaimerEnabled) {
            this.disclaimerMessage = await RemoteConfig.INSTANCE.disclaimerMessage();
            this.disclaimerSeverity = await RemoteConfig.INSTANCE.disclaimerSeverity();
        }
    }

    async refreshLieux() {
        const currentSearch = this.currentSearch
        if(currentSearch) {
            // FIXME move all of this to testable file
            const codeDepartement = SearchRequest.isByDepartement(currentSearch)
              ? currentSearch.departement.code_departement
              : currentSearch.commune.codeDepartement
            try {
                this.searchInProgress = true;
                await delay(1) // give some time (one tick) to render loader before doing the heavy lifting
                this.lieuxParDepartement = await State.current.lieuxPour([codeDepartement].concat(this.options.codeDepartementAdditionnels(codeDepartement)));
                
                this.rafraichirDonneesAffichees();

                const commune = SearchRequest.isByCommune(currentSearch) ? currentSearch.commune : undefined
                Analytics.INSTANCE.rechercheLieuEffectuee(
                    codeDepartement,
                    this.currentTri(),
                    currentSearch.type,
                    this.jourSelectionne?.type,
                    this.jourSelectionne?.date,
                    commune,
                    this.lieuxParDepartementAffiches);
            } finally {
                this.searchInProgress = false;
            }
        } else {
            this.lieuxParDepartementAffiches = undefined;
            this.cartesAffichees = [];
        }

        this.disclaimerEnabled = await RemoteConfig.INSTANCE.disclaimerEnabled();
        // Refresh only if needed
        if (this.disclaimerEnabled) {
            this.disclaimerMessage = await RemoteConfig.INSTANCE.disclaimerMessage();
            this.disclaimerSeverity = await RemoteConfig.INSTANCE.disclaimerSeverity();
        }
    }

    private autoSelectJourSelectionne(daySelectorAvailable: boolean) {
        if(daySelectorAvailable) {
            // On voit quel jour selectionner:
            // 1/ on essaie de conserver le même jour selectionné si possible
            // 2/ si pas possible (pas de créneau) on prend le premier jour dispo avec des créneaux
            // 3/ si pas possible (aucun jour avec des créneaux) aucun jour n'est sélectionné
            if(this.jourSelectionne) {
                const creneauxQuotidienSelectionnes = this.creneauxQuotidiensAffiches.find(cq => cq.date === this.jourSelectionne?.date);
                if(!creneauxQuotidienSelectionnes || creneauxQuotidienSelectionnes.total===0) {
                    this.jourSelectionne = undefined;
                }
            }
            if(!this.jourSelectionne) {
                this.jourSelectionne = {
                    date: this.creneauxQuotidiensAffiches.filter(dailyAppointments => dailyAppointments.total !== 0)[0]?.date,
                    type: 'auto'
                };
            }
        } else {
            this.jourSelectionne = undefined;
        }
    }

    rafraichirDonneesAffichees() {

        if(this.currentSearch && this.workshopsParDepartement) {
            const searchTypeConfig = searchTypeConfigFor(this.currentSearch.type);
            const workshopsMatchantCriteres = this.filtrerWorkshopsMatchantLesCriteres(this.workshopsParDepartement, this.currentSearch);
            // const workshopsMatchantCriteres = this.workshopsParDepartement;

            let daySelectorAvailable = this.daySelectorAvailable;
            this.autoSelectJourSelectionne(daySelectorAvailable);

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
        Router.navigateToUrlIfPossible(workshop.tickets_link);
      }
      
      private verifierRdv(workshop: Workshop) {
        Router.navigateToUrlIfPossible(workshop.source_link);
    }

    private currentTri(): CodeTriCentre|"unknown" {
      return this.currentSearch?this.currentSearch.tri:'unknown';
    }

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

@customElement('vmd-rdv-par-commune')
export class VmdRdvParCommuneView extends AbstractVmdRdvView {
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
    @internalProperty() private _distanceSelectionnee: number = 100;

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
              <vmd-input-range-with-tooltip
                  id="searchAppointment-distance" codeSelectionne="${this._distanceSelectionnee}"
                  theme="${this.searchTypeConfig.theme}"
                  .options="${[
                    {code: 5, libelle:"<5km"},
                    {code: 10, libelle:"<10km"}, {code: 50, libelle:"<50km"},
                    {code: 100, libelle:"<100km"}, {code: 250, libelle:"<250km"},
                    {code: 500, libelle:"<500km"}, {code: 100000, libelle:"∞"}
                  ]}"
                  @option-selected="${(e: CustomEvent<{value: number}>) => { this._distanceSelectionnee = e.detail.value; this.rafraichirDonneesAffichees(); }}"
              ></vmd-input-range-with-tooltip>
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
          this.currentSearch = SearchRequest.ByCommune(commune, this._searchType, this.jourSelectionne?.date, this._onlineEvents)
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

@customElement('vmd-rdv-par-departement')
export class VmdRdvParDepartementView extends AbstractVmdRdvView {
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
            this.currentSearch = SearchRequest.ByDepartement(departementSelectionne, this._searchType, this.jourSelectionne?.date, this._onlineEvents)
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

        workshopsAffichablesBuilder.sortBy(l => this.extraireFormuleDeTri(l, 'date'))
        // workshopsAffichablesBuilder.sortBy(l => this.extraireFormuleDeTri(l, 'distance'))

        const workshopsMatchantCriteres = workshopsAffichablesBuilder.build();
        return workshopsMatchantCriteres;
    }
}
