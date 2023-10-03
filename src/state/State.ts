import {Strings} from "../utils/Strings";
import { Autocomplete } from './Autocomplete'
import { Memoize } from 'typescript-memoize'
import { RemoteConfig } from "../utils/RemoteConfig";

export type CodeTrancheAge = 'plus75ans';
export type TrancheAge = {
    codeTrancheAge: CodeTrancheAge;
    libelle: string;
};
export const TRANCHES_AGE: Map<CodeTrancheAge, TrancheAge> = new Map([
    ['plus75ans', { codeTrancheAge: 'plus75ans', libelle: "Plus de 75 ans" }]
]);


export type SearchRequest = SearchRequest.ByCommune | SearchRequest.ByDepartement
export namespace SearchRequest {
  export type ByDepartement = {
      type: SearchType,
      par: 'departement',
      departement: Departement,
      tri: 'date',
      online: boolean
  }
  export function ByDepartement (departement: Departement, type: SearchType, online: boolean): ByDepartement {
    return { type, par: 'departement', departement, tri: 'date', online }
  }
  export function isByDepartement (searchRequest: SearchRequest): searchRequest is ByDepartement {
    return searchRequest.par === 'departement'
  }

  export type ByCommune = {
    type: SearchType,
    par: 'commune',
    commune: Commune,
    tri: 'distance',
    online: boolean
  }
  export function ByCommune (commune: Commune, type: SearchType, online: boolean): ByCommune {
    return { type, par: 'commune', commune, tri: 'distance', online }
  }
  export function isByCommune (searchRequest: SearchRequest): searchRequest is ByCommune {
    return searchRequest.par === 'commune'
  }
}

export type CodeTriCentre = 'date' | 'distance';

export type TypePlateforme = "Doctolib"|"Maiia"|"Ordoclic"|"Keldoc"|"Pandalab"|"Mapharma"|"AvecMonDoc"|"Clikodoc"|"mesoigner"|"Bimedoc"|"Valwin";

enum TypeAtelierEnum {
  "FresqueNouveauxRecits" = 0,
  "FresqueOceane" = 1,
  "FresqueBiodiversite" = 2,
  "FresqueNumerique" = 3,
  "FresqueAgriAlim" = 4,
  "FresqueAlimentation" = 5,
  "FresqueConstruction" = 6,
  "FresqueMobilite" = 7,
  "FresqueSexisme" = 8,
  "OGRE" = 9,
  "AtelierNosViesBasCarbone" = 10,
  "FresqueDeLeau" = 11,
  "FutursProches" = 12,
  "FresqueDiversite" = 13,
  "FresqueDuTextile" = 14,
  "FresqueDesDechets" = 15,
  "2tonnes" = 100,
  "FresqueClimat" = 200,
  "FresqueEcoCirculaire" = 300,
}

export type TypeAtelier = keyof typeof TypeAtelierEnum;

export type Atelier = {
    // Should be the same than PLATEFORMES' key
    code: TypeAtelier;
    logo: string;
    nom: string;
    // Should we do promotion of this plateform ? for example on home screen ?
    // (typically, it may be not a good idea to promote the platform while JSON is not producing data for it yet)
    promoted: boolean;
    website: string;
    // Used for specific styling on logos, see for example _searchAppointment.scss
    styleCode: string;
};

export const ATELIERS: Record<number, Atelier> = {
    300: { code: 'FresqueEcoCirculaire', logo: 'logo_fresqueEcoCirculaire.webp', nom: 'Fresque de l\'économie circulaire', promoted: true, website: 'https://www.lafresquedeleconomiecirculaire.com/', styleCode: '_fresqueEcoCirc' },
    200: { code: 'FresqueClimat', logo: 'logo_fresqueClimat.png', nom: 'Fresque du Climat', promoted: true, website: 'https://fresqueduclimat.org/', styleCode: '_fresqueClimat' },
    100: { code: '2tonnes', logo: 'logo_2tonnes.webp', nom: '2tonnes', promoted: true, website: 'https://www.2tonnes.org/', styleCode: '_2tonnes' },
    2: { code: 'FresqueBiodiversite', logo: 'logo_fresqueBiodiversite.svg', nom: 'Fresque de la Biodiversité', promoted: false, website: 'https://www.fresquedelabiodiversite.org/', styleCode: '_fresqueBiodiversite' },
    1: { code: 'FresqueOceane', logo: 'logo_fresqueOceane.webp', nom: 'Fresque Océane', promoted: true, website: 'https://www.fresqueoceane.org/', styleCode: '_fresqueOceane' },
    4: { code: 'FresqueAgriAlim', logo: 'logo_fresqueAgriAlim.png', nom: 'Fresque Agri\'Alim', promoted: true, website: 'https://fresqueagrialim.org/', styleCode: '_fresqueAgriAlim' },
    3: { code: 'FresqueNumerique', logo: 'logo_fresqueNumerique.png', nom: 'Fresque du Numérique', promoted: false, website: 'https://www.fresquedunumerique.org/', styleCode: '_fresqueNumerique' },
    0: { code: 'FresqueNouveauxRecits', logo: 'logo_fresqueNouveauxRecits.png', nom: 'Fresque des Nouveaux Récits', promoted: true, website: 'https://www.fresquedesnouveauxrecits.org/', styleCode: '_fresqueNouveauRevits' },
    7: { code: 'FresqueMobilite', logo: 'logo_fresqueMobilite.png', nom: 'Fresque de la Mobilité', promoted: true, website: 'https://fresquedelamobilite.org/', styleCode: '_fresqueMobilite' },
    5: { code: 'FresqueAlimentation', logo: 'logo_fresqueAlimentation.svg', nom: 'Fresque de l\'Alimentation', promoted: true, website: 'https://fresquealimentation.org/', styleCode: '_fresqueAlimentation' },
    9: { code: 'OGRE', logo: 'logo_OGRE.png', nom: 'OGRE', promoted: true, website: 'https://atelierogre.org/', styleCode: '_logoOGRE' },
    6: { code: 'FresqueConstruction', logo: 'logo_fresqueConstruction.webp', nom: 'Fresque de la Construction', promoted: true, website: 'https://www.fresquedelaconstruction.org/', styleCode: '_fresqueConstruction' },
    8: { code: 'FresqueSexisme', logo: 'logo_fresqueSexisme.png', nom: 'Fresque du Sexisme', promoted: false, website: 'https://www.facebook.com/FresqueDuSexisme/', styleCode: '_fresqueSexisme' },
    10: { code: 'AtelierNosViesBasCarbone', logo: 'logo_NVBC.png', nom: 'Nos Vies Bas Carbone', promoted: true, website: 'https://www.nosviesbascarbone.org/', styleCode: '_atelierNVBC' },
    11: { code: 'FresqueDeLeau', logo: 'logo_fresqueDeLeau.png', nom: 'Fresque de l\'Eau', promoted: true, website: 'https://www.eaudyssee.org/', styleCode: '_fresqueDeLeau' },
    12: { code: 'FutursProches', logo: 'logo_FutursProches.png', nom: 'Futurs Proches', promoted: true, website: 'https://futursproches.com/', styleCode: '_futursProches' },
    13: { code: 'FresqueDiversite', logo: 'logo_fresqueDiversite.png', nom: 'Fresque de la Diversité', promoted: true, website: 'https://fresquedeladiversite.org/', styleCode: '_fresqueDiversite' },
    14: { code: 'FresqueDuTextile', logo: 'logo_greenDonut.png', nom: 'Fresque du Textile', promoted: true, website: 'https://greendonut.org/', styleCode: '_fresqueTextile' },
    15: { code: 'FresqueDesDechets', logo: 'logo_greenDonut.png', nom: 'Fresque des Déchets', promoted: false, website: 'https://greendonut.org/', styleCode: '_fresqueDechets' },
};

export type CodeDepartement = string;
export type Departement = {
    code_departement: CodeDepartement;
    nom_departement: string;
    code_region: number;
    nom_region: string;
};

// Permet de convertir un nom de departement en un chemin d'url correct (remplacement des caractères
// non valides comme les accents ou les espaces)
export const libelleUrlPathDuDepartement = (departement: Departement) => {
    return Strings.toReadableURLPathValue(departement.nom_departement);
}

export type ISODateString = string

export type Workshop = {
    address: string;
    city: string;
    department: CodeDepartement;
    description: string;
    end_date: ISODateString;
    full_location: string;
    kids: boolean;
    latitude: number;
    longitude: number;
    location_name: string;
    online: boolean;
    scrape_date: ISODateString;
    sold_out: boolean;
    source_link: string;
    start_date: ISODateString;
    tickets_link: string;
    title: string;
    training: boolean;
    workshop_type: number;
    zip_code: string;
};

export type Coordinates = { latitude: number, longitude: number }
export type Location = Coordinates & {city: string, cp: string}


export type WorkshopsParDepartement = {
    workshopsDisponibles: Workshop[];
    codeDepartements: CodeDepartement[];
    derniereMiseAJour: ISODateString;
};

export type WorkshopsAffichableAvecDistance = Workshop & { distance: number|undefined };
export type WorkshopsAvecDistanceParDepartement = {
    workshopsMatchantCriteres: WorkshopsAffichableAvecDistance[];
    workshopsDisponibles: WorkshopsAffichableAvecDistance[];
    codeDepartements: CodeDepartement[];
    derniereMiseAJour: ISODateString;
};

function convertDepartementForSort(codeDepartement: CodeDepartement) {
    switch(codeDepartement) {
        case '2A': return '20A';
        case '2B': return '20B';
        default: return codeDepartement;
    }
}

const DEPARTEMENT_OM: Departement = {
    code_departement: 'om',
    nom_departement: "Collectivités d'Outremer",
    code_region: -1,
    nom_region: "Outremer"
};


export type CommunesParAutocomplete = Map<string, Commune[]>;
export interface Commune {
    code: string;
    codePostal: string;
    nom: string;
    codeDepartement: string;
    latitude: number;
    longitude: number;
}


// Permet de convertir un nom de departement en un chemin d'url correct (remplacement des caractères
// non valides comme les accents ou les espaces)
export const libelleUrlPathDeCommune = (commune: Commune) => {
    return Strings.toReadableURLPathValue(commune.nom);
}

/*
type VaccineCategory = {code: SearchType, libelle: string};
export const VACCINE_CATEGORIES: VaccineCategory[] = [
    { code: "18_55", libelle: "Préconisé pour les 18-55 ans" },
    // { code: "16_18", libelle: "Préconisé pour les 16-18 ans" },
    { code: "standard", libelle: "Tous" },
];
 */

export type SearchType = "standard" | "atelier" |"formation"|"junior";
export const TYPE_RECHERCHE_PAR_DEFAUT: SearchType = "atelier";

export type SearchTypeConfig = {
    pathParam: string;
    standardTabSelected: boolean;
    excludeAppointmentByPhoneOnly: boolean;
    jourSelectionnable: boolean;
    theme: 'standard'|'highlighted';
};
const SEARCH_TYPE_CONFIGS: {[type in SearchType]: SearchTypeConfig & {type: type}} = {
    'standard': {
        type: 'standard',
        pathParam: 'standard',
        standardTabSelected: true,
        excludeAppointmentByPhoneOnly: false,
        jourSelectionnable: true,
        theme: 'standard',
    },
    'atelier': {
        type: 'atelier',
        pathParam: 'atelier',
        standardTabSelected: true,
        excludeAppointmentByPhoneOnly: false,
        jourSelectionnable: true,
        theme: 'standard',
    },
    'formation': {
        type: 'formation',
        pathParam: 'formation',
        standardTabSelected: true,
        excludeAppointmentByPhoneOnly: false,
        jourSelectionnable: true,
        theme: 'standard',
    },
    'junior': {
        type: 'junior',
        pathParam: 'junior',
        standardTabSelected: true,
        excludeAppointmentByPhoneOnly: false,
        jourSelectionnable: true,
        theme: 'standard',
    }
};
export function searchTypeConfigFromPathParam(pathParams: Record<string,string>): SearchTypeConfig & {type: SearchType} {
    const config = Object.values(SEARCH_TYPE_CONFIGS).find(config => pathParams && config.pathParam === pathParams['typeRecherche']);
    if(config) {
        return config;
    }
    throw new Error(`No config found for path param: ${pathParams['typeRecherche']}`);
}
export function searchTypeConfigFromSearch(searchRequest: SearchRequest|void, fallback: SearchType) {
    return searchTypeConfigFor(searchRequest ? searchRequest.type : fallback);
}
export function searchTypeConfigFor(searchType: SearchType): SearchTypeConfig & {type: SearchType} {
    return SEARCH_TYPE_CONFIGS[searchType];
}

export class State {

    @Memoize()
    public static get current (): State {
      return new State()
    }

    private static DEPARTEMENT_VIDE: Departement = {
        code_departement: "",
        code_region: 0,
        nom_departement: "",
        nom_region: ""
    };

    private static COMMUNE_VIDE: Commune = {
        code: "",
        codeDepartement: "",
        codePostal: "",
        latitude: 0,
        longitude: 0,
        nom: ""
    };

    readonly autocomplete: Autocomplete

    private constructor() {
        const webBaseUrl = import.meta.env.BASE_URL
        this.autocomplete = new Autocomplete(webBaseUrl, () => this.departementsDisponibles())
    }

    async allWorkshops(): Promise<WorkshopsParDepartement> {
        const urlGenerator = await RemoteConfig.INSTANCE.urlGenerator();
        const workshops : Workshop[] = await fetch(urlGenerator.workshops()).then(resp => resp.json());
        return {
            workshopsDisponibles: workshops,
            codeDepartements: [],
            derniereMiseAJour: workshops.length?workshops[0].scrape_date : new Date().toISOString()
        };
    }

    async workshopsPour(codesDepartements: CodeDepartement[]): Promise<WorkshopsParDepartement> {
        const urlGenerator = await RemoteConfig.INSTANCE.urlGenerator();
        const workshops : Workshop[] = await fetch(urlGenerator.workshops()).then(resp => resp.json());
        
        const workshopsParDepartement : WorkshopsParDepartement={
            workshopsDisponibles: workshops.filter((workshop: Workshop) => workshop.online || codesDepartements.includes(workshop.department)),
            codeDepartements: codesDepartements,
            derniereMiseAJour: workshops.length?workshops[0].scrape_date : new Date().toISOString()
        }

        return workshopsParDepartement;
    }

    @Memoize()
    async departementsDisponibles(): Promise<Departement[]> {
        const urlGenerator = await RemoteConfig.INSTANCE.urlGenerator();
        const resp = await fetch(urlGenerator.listDepartements());
        const departements: Departement[] = await resp.json();

        if (!departements.find(d => d.code_departement === DEPARTEMENT_OM.code_departement)) {
            // The OM departement is missing in back-end departements.json.
            departements.push(DEPARTEMENT_OM);
        }

        return departements.sort((d1, d2) => convertDepartementForSort(d1.code_departement).localeCompare(convertDepartementForSort(d2.code_departement)))
    }

    async chercheDepartementParCode(code: string): Promise<Departement> {
        let deps = await this.departementsDisponibles();
        return deps.find(dep => dep.code_departement === code) || State.DEPARTEMENT_VIDE;
    }

    async chercheCommuneParCode(codePostal: string, codeCommune: string): Promise<Commune> {
        const commune = await this.autocomplete.findCommune(codePostal, codeCommune)
        return commune || State.COMMUNE_VIDE
    }

}
