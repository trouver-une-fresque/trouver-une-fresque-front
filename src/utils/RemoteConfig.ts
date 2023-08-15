import {DataUrlGenerator, GITHUB_DATA_URLS} from "./LocalConfig";

type RemoteConfigEntries = {
    "chronodose_min_count": string,
    "data_disclaimer_enabled": string,
    "data_disclaimer_message": string,
    "data_disclaimer_repeat_days": string,
    "data_disclaimer_severity": string,
    "path_contributors": string,
    "path_data_department": string,
    "path_list_departments": string,
    "url_base": string,
    "vaccination_centres_list_radius_in_km": string,
};

const REMOTE_CONFIG_ENTRIES_FALLBACK: RemoteConfigEntries = {
    "chronodose_min_count": "2",
    "data_disclaimer_enabled": "false",
    "data_disclaimer_message": "Les plateformes sont très sollicitées, les données affichées par Vite Ma Dose peuvent avoir jusqu'à 15 minutes de retard pour Doctolib.",
    "data_disclaimer_repeat_days": "5",
    "data_disclaimer_severity": "warning",
    "path_contributors": "/vitemadose/contributors_all.json",
    "path_data_department": "/vitemadose/{code}.json",
    "path_list_departments": "/vitemadose/departements.json",
    "url_base": "https://vitemadose.gitlab.io",
    "vaccination_centres_list_radius_in_km": "50"
};

export class RemoteConfig {
    public static readonly INSTANCE = new RemoteConfig();

    private configuration: RemoteConfigEntries|undefined = undefined;
    private _urlGenerator: DataUrlGenerator|undefined = undefined;
    private configurationSyncedPromise: Promise<void>|undefined = undefined;

    private constructor() {
    }

    public static currentEnv(): 'prod'|'testing'|'dev'|'unknown' {
        if(document.location.host === 'vitemadose.covidtracker.fr') {
            return 'prod';
        } else if(document.location.host === 'dev.vitemado.se') {
            return 'testing';
        } else if(['localhost', '127.0.0.1'].includes(document.location.host)) {
            return 'dev';
        } else {
            return 'unknown';
        }
    }
    
    async sync() {
        const firebaseConfig = (RemoteConfig.currentEnv() === 'prod')?{
            apiKey: "AIzaSyBl4_aecaPMtvy458zFbmDKu3rHfOZyaQU",
            projectId: "vite-ma-dose",
            appId: "1:304644690082:web:e12d50228bc4493b25c7fb"
        }:{
            apiKey: "AIzaSyC5lncyBHo4HAmMecIvokok1A5PWWRrutw",
            projectId: "vite-ma-dose-dev",
            appId: "1:812389299998:web:ff949f4962d751b45dfb0f"
        };

        if(RemoteConfig.currentEnv() !== 'prod' && import.meta.env.VITE_OFFLINE_MODE === 'true') {
            this.configuration = REMOTE_CONFIG_ENTRIES_FALLBACK;
            this._urlGenerator = {
                listDepartements: () => `/offline/departements.json`,
                infosDepartement: (codeDepartement) => `/offline/${codeDepartement}.json`,
                creneauxQuotidiensDepartement: (codeDepartement) => `/offline/${codeDepartement}/creneaux-quotidiens.json`,
                workshops: () => `/offline/workshops.json`
            };
            this.configurationSyncedPromise = Promise.resolve();

            return this.configurationSyncedPromise;
        }

        this.configurationSyncedPromise = fetch(`https://firebaseinstallations.googleapis.com/v1/projects/${firebaseConfig.projectId}/installations`, {
            method: 'POST',
            headers: {
                'x-goog-api-key': firebaseConfig.apiKey
            },
            body: JSON.stringify({
                "appId": firebaseConfig.appId,
                "sdkVersion":"w:0.4.30"
            })
        }).then(resp => resp.json())
          .then(installation => fetch(`https://firebaseremoteconfig.googleapis.com/v1/projects/${firebaseConfig.projectId}/namespaces/firebase:fetch?key=${firebaseConfig.apiKey}`, {
              method: 'POST',
              body: JSON.stringify({
                "app_instance_id": installation.fid,
                "app_id": firebaseConfig.appId
              })
          })).then(resp => resp.json())
            .then(remoteConfig => {
                this.configuration = remoteConfig.entries as RemoteConfigEntries;

                // If false, rawgithub will be used
                // but keep in mind that firebase remote config will be taken first

                // let urlBase = this.configuration.url_base;
                // if(urlBase) {
                //     const statsPath = this.configuration.path_stats || `/vitemadose/stats.json`;
                //     const statsByDatePath = `/vitemadose/stats_by_date.json`;
                //     const departementsListPath = this.configuration.path_list_departments || `/vitemadose/departements.json`;
                //     const infosDepartementPath = this.configuration.path_data_department || `/vitemadose/{code}.json`;
                //     this._urlGenerator = {
                //         listDepartements: () => `${urlBase}${departementsListPath}`,
                //         statsByDate: () => `${urlBase}${statsByDatePath}`,
                //         stats: () => `${urlBase}${statsPath}`,
                //         infosDepartement: (codeDepartement) => `${urlBase}${infosDepartementPath.replace('{code}', codeDepartement)}`,
                //         creneauxQuotidiensDepartement: (codeDepartement) => `${urlBase}/vitemadose/${codeDepartement}/creneaux-quotidiens.json`,
                //         workshops: () => `${urlBase}/workshops.json`
                //     };
                // } else {
                    this._urlGenerator = GITHUB_DATA_URLS;
                // }

                return undefined as void;
            })

        return this.configurationSyncedPromise;
    }

    async urlGenerator() {
        await this.configurationSyncedPromise;
        return this._urlGenerator! as DataUrlGenerator;
    }

    async disclaimerEnabled() {
        await this.configurationSyncedPromise;
        return this.configuration!.data_disclaimer_enabled === 'true';
    }
    
    async disclaimerMessage() {
        await this.configurationSyncedPromise;
        return this.configuration!.data_disclaimer_message;
    }

    async disclaimerSeverity() {
        await this.configurationSyncedPromise;
        return this.configuration!.data_disclaimer_severity.toLowerCase() as DisclaimerSeverity;
    }
}

export type DisclaimerSeverity = 'warning' | 'error';
