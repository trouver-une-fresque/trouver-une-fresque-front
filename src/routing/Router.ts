import page from "page";
import { TemplateResult } from "lit-html";
import {html} from "lit-element";
import {
    CodeTriCentre,
    SearchType,
    searchTypeConfigFor,
    searchTypeConfigFromPathParam,
    State
} from "../state/State";
import {Analytics} from "../utils/Analytics";
// @ts-ignore
import {rechercheDepartementDescriptor, rechercheCommuneDescriptor} from './DynamicURLs';

export type SlottedTemplateResultFactory = (subViewSlot: TemplateResult) => TemplateResult;

export type ViewChangedCallback = (templateResultCreator: SlottedTemplateResultFactory, path: string) => void;
export type ViewChangedCallbackCleaner = Function;
export type TitleProvider = (pathParams: Record<string, string>) => Promise<string>;

type RouteDeclaration = {
    pathPattern: string|string[];
    analyticsViewName: (pathParams: Record<string, string>) => string;
    viewContent: (pathParams: Record<string, string>) => Promise<SlottedTemplateResultFactory>|SlottedTemplateResultFactory;
    pageTitleProvider?: TitleProvider;
};

class Routing {
    public static readonly INSTANCE = new Routing();

    private static readonly DEFAULT_TITLE = 'Trouver Une Fresque : trouvez une fresque près de chez vous';
    private static readonly DEFAULT_TITLE_PROMISE: TitleProvider =
        () => Promise.resolve(Routing.DEFAULT_TITLE);

    private _viewChangeCallbacks: ViewChangedCallback[] = [];

    private currentPath: string|undefined = undefined;

    public get basePath() {
        return import.meta.env.BASE_URL;
    }

    installRoutes(callback?: ViewChangedCallback): ViewChangedCallbackCleaner|undefined {
        const callbackCleaner = callback?this.onViewChanged(callback):undefined;

        page.redirect(`${this.basePath}home`, `/`);
        page.redirect(`${this.basePath}index.html`, `/`);

        this.declareRoutes({
            pathPattern: `/`,
            analyticsViewName: () => 'home',
            viewContent: async () => {
                await import('../views/vmd-home.view')
                return (subViewSlot) =>
                    html`<vmd-home>${subViewSlot}</vmd-home>`
            }
        });

        this.declareRoutes({
            pathPattern: [
                `/centres-vaccination-covid-dpt:codeDpt-:nomDpt`,
                rechercheDepartementDescriptor.routerUrl
            ],
            analyticsViewName: (pathParams) => searchTypeConfigFromPathParam(pathParams).analytics.searchResultsByDepartement,
            viewContent: async (params) => {
                await import('../views/vmd-rdv.view');
                return (subViewSlot) =>
                    html`<vmd-rdv-par-departement
                        searchType="${searchTypeConfigFromPathParam(params).type}"
                        codeDepartementSelectionne="${params[`codeDpt`]}"
                        onlineEventsSelectionne="${params[`includesOnline`]}">
                      ${subViewSlot}
                    </vmd-rdv-par-departement>`
            },
            pageTitleProvider: (params) =>
                State.current.chercheDepartementParCode(params[`codeDpt`])
                    .then(nomDpt => `Fresques en ${nomDpt.nom_departement} ${params[`codeDpt`]}`)
        });

        this.declareRoutes({
            pathPattern: [
                `/centres-vaccination-covid-dpt:codeDpt-:nomDpt/commune:codeCommune-:codePostal-:nomCommune/en-triant-par-:codeTriCentre`,
                rechercheCommuneDescriptor.routerUrl
            ],
            analyticsViewName: (pathParams) => searchTypeConfigFromPathParam(pathParams).analytics.searchResultsByCity,
            viewContent: async (params) => {
                await import('../views/vmd-rdv.view');
                return (subViewSlot) =>
                    html`<vmd-rdv-par-commune
                    searchType="${searchTypeConfigFromPathParam(params).type}"
                    codeCommuneSelectionne="${params[`codeCommune`]}"
                    codePostalSelectionne="${params[`codePostal`]}"
                    critèreDeTri="${params[`codeTriCentre`]}"
                    onlineEventsSelectionne="${params[`includesOnline`]}">
                  ${subViewSlot}
                </vmd-rdv-par-commune>`
            },
            pageTitleProvider: (params) =>
                State.current.chercheCommuneParCode(params['codePostal'], params['codeCommune'])
                    .then(commune => `Fresques à ${commune.nom} ${commune.codePostal}`)
        });
        this.declareRoutes({
            pathPattern: [
                // Legacy URLs with tranche age inside ... used only for old URLs referenced by Google
                '/centres',
                // Proper URL really used
                '/lieux'
            ],
            analyticsViewName: () => 'centres',
            viewContent: async () => {
                await import('../views/vmd-lieux.view');
                return (subViewSlot) =>
                    html`<vmd-lieux>${subViewSlot}</vmd-lieux>`
            }
        });
        this.declareRoutes({
            pathPattern: `/statistiques`,
            analyticsViewName: () => 'statistiques',
            viewContent: async () => {
                await import('../views/vmd-statistiques.view');
                return (subViewSlot) =>
                    html`<vmd-statistiques>${subViewSlot}</vmd-statistiques>`
            }
        });
        this.declareRoutes({
            pathPattern: `/apropos`,
            analyticsViewName: () => 'a_propos',
            viewContent: async () => {
                await import('../views/vmd-apropos.view');
                return (subViewSlot) =>
                    html`<vmd-apropos>${subViewSlot}</vmd-apropos>`
            }
        });
        this.declareRoutes({
            pathPattern: `/mentions-legales`,
            analyticsViewName: () => 'mentions_legales',
            viewContent: async () => {
                await import('../views/tuf-mentions.view');
                return (subViewSlot) =>
                    html`<tuf-mentions>${subViewSlot}</tuf-mentions>`
            }
        });
        // Legacy URL
        page.redirect(`${this.basePath}chronodose`, `/`);

        page(`*`, (context) => Routing._notFoundRoute(context));
        page();

        return callbackCleaner;
    }

    private declareRoutes(routeDeclaration: RouteDeclaration) {
        const paths: string[] = (typeof routeDeclaration.pathPattern === 'string') ? [routeDeclaration.pathPattern] : routeDeclaration.pathPattern;
        paths.forEach(path => {
            this._declareRoute(
                path,
                routeDeclaration.analyticsViewName,
                routeDeclaration.viewContent,
                routeDeclaration.pageTitleProvider || Routing.DEFAULT_TITLE_PROMISE
            );
        });
    }

    private _declareRoute(path: string, pageNameSupplier: (pathParams: Record<string,string>) => string, viewComponentCreator: (pathParams: Record<string, string>) => Promise<SlottedTemplateResultFactory>|SlottedTemplateResultFactory,
                         titlePromise = Routing.DEFAULT_TITLE_PROMISE) {
        page(`${this.basePath}${path.substring(path[0]==='/'?1:0)}`, (context) => {
            const slottedViewComponentFactoryResult = viewComponentCreator(context.params);

            Promise.all([
                ((slottedViewComponentFactoryResult instanceof Promise)?
                    slottedViewComponentFactoryResult
                    :
                    Promise.resolve(slottedViewComponentFactoryResult)),
                titlePromise(context.params).catch(() => Routing.DEFAULT_TITLE)
            ]).then(([slottedViewTemplateFactory, title]) => {
                if(this.currentPath === '/' && window.matchMedia("(max-width: 700px)").matches) { 
                    window.scroll({ top: 0, behavior: 'smooth' });
                }

                this.currentPath = path;

                document.title = title;

                this._viewChangeCallbacks.forEach(callback => callback(slottedViewTemplateFactory, path));
                Analytics.INSTANCE.navigationSurNouvellePage(pageNameSupplier(context.params));
            })
        });
    }

    onViewChanged(callback: ViewChangedCallback): ViewChangedCallbackCleaner {
        this._viewChangeCallbacks.push(callback);
        return () => {
            const idx = this._viewChangeCallbacks.findIndex(registeredCallback => registeredCallback === callback);
            this._viewChangeCallbacks.splice(idx, 1);
        }
    }

    private static _notFoundRoute(context: PageJS.Context) {
        let notFoundUrl: string = window.location.protocol + '//' + window.location.host + '/404.html';
        console.error(`Route not found : ${context.path} ! Redirecting to ${notFoundUrl}`);
        window.location.href = notFoundUrl;
    }

    public navigateToRendezVousAvecDepartement(codeDepartement: string, pathLibelleDepartement: string, searchType: SearchType, online: boolean) {
        page(this.getLinkToRendezVousAvecDepartement(codeDepartement, pathLibelleDepartement, searchType, online));
    }

    public getLinkToRendezVousAvecDepartement(codeDepartement: string, pathLibelleDepartement: string, searchType: SearchType, online: boolean) {
        return `${this.basePath}centres-vaccination-covid-dpt${codeDepartement}-${pathLibelleDepartement}/recherche-${searchTypeConfigFor(searchType).pathParam}/online-${online?'oui':'non'}`;
    }

    public navigateToRendezVousAvecCommune(codeTriCentre: CodeTriCentre, codeDepartement: string, pathLibelleDepartement: string, codeCommune: string, codePostal: string, pathLibelleCommune: string, searchType: SearchType, online: boolean) {
        page(`${this.basePath}centres-vaccination-covid-dpt${codeDepartement}-${pathLibelleDepartement}/commune${codeCommune}-${codePostal}-${pathLibelleCommune}/recherche-${searchTypeConfigFor(searchType).pathParam}/en-triant-par-${codeTriCentre}/online-${online?'oui':'non'}`);
    }

    navigateToHome() {
        page(`${this.basePath}`);
    }

    navigateToUrlIfPossible(url: string) {
        if(url) {
            window.open(url, '_blank', 'noreferrer')
        }
    }
}

export const Router = Routing.INSTANCE;
