import type {CodeTriCentre} from "../state/State";
import {Strings} from "../utils/Strings";

export const rechercheDepartementDescriptor = {
    routerUrl: '/dpt:codeDpt-:nomDpt/recherche-:typeRecherche/online-:includesOnline',
    urlGenerator: ({codeDepartement, nomDepartement}: {codeDepartement: string, nomDepartement: string}) => {
        return ['standard', /* '18_55' */, 'dose_rappel', 'dose_1_enfants', 'dose_1_ou_2'].map(typeRecherche => {
            return `/dpt${codeDepartement}-${Strings.toReadableURLPathValue(nomDepartement)}/recherche-${typeRecherche}/online-non`;
        });
    }
};

export const rechercheCommuneDescriptor = {
    routerUrl: '/dpt:codeDpt-:nomDpt/commune:codeCommune-:codePostal-:nomCommune/recherche-:typeRecherche/en-triant-par-:codeTriCentre/online-:includesOnline',
    urlGenerator: ({codeDepartement, nomDepartement, codeCommune, codePostal, nomCommune, tri}: {codeDepartement: string, nomDepartement: string, codeCommune: string, codePostal: string, nomCommune: string, tri: CodeTriCentre}) => {
        return ['standard', /* '18_55' */, 'dose_rappel', 'dose_1_enfants', 'dose_1_ou_2'].map(typeRecherche => {
            return `/dpt${codeDepartement}-${Strings.toReadableURLPathValue(nomDepartement)}/commune${codeCommune}-${codePostal}-${Strings.toReadableURLPathValue(nomCommune)}/recherche-${typeRecherche}/en-triant-par-${tri}/online-non`;
        })
    }
};
