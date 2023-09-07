import {DataUrlGenerator, GITHUB_DATA_URLS} from "./LocalConfig";

type RemoteConfigEntries = {
    "path_contributors": string,
    "path_data_department": string,
    "path_list_departments": string,
    "url_base": string,
    "api_base": string|undefined,
};


const REMOTE_CONFIG_ENTRIES: RemoteConfigEntries = {
    "path_contributors": "/vitemadose/contributors_all.json",
    "path_data_department": "/vitemadose/{code}.json",
    "path_list_departments": "/vitemadose/departements.json",
    "url_base": "https://trouverunefresque.org",
    "api_base": "https://marbeuf.ddns.net/trouverunefresque",
};

const REMOTE_CONFIG_ENTRIES_FALLBACK: RemoteConfigEntries = {
    "path_contributors": "/vitemadose/contributors_all.json",
    "path_data_department": "/vitemadose/{code}.json",
    "path_list_departments": "/vitemadose/departements.json",
    "url_base": "https://trouverunefresque.org",
    "api_base": undefined,
};

export class RemoteConfig {
    public static readonly INSTANCE = new RemoteConfig();

    private configuration: RemoteConfigEntries|undefined = undefined;
    private _urlGenerator: DataUrlGenerator|undefined = undefined;
    private configurationSyncedPromise: Promise<void>|undefined = undefined;

    private constructor() {
    }

    public static currentEnv(): 'prod'|'testing'|'dev'|'unknown' {
        if(document.location.host === 'trouverunefresque.org') {
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
        if (RemoteConfig.currentEnv() !== 'prod' && import.meta.env.VITE_OFFLINE_MODE === 'true') {
            this.configuration = REMOTE_CONFIG_ENTRIES_FALLBACK;
            this._urlGenerator = GITHUB_DATA_URLS
            this.configurationSyncedPromise = Promise.resolve();
            return this.configurationSyncedPromise;
        } else {
            this.configuration = REMOTE_CONFIG_ENTRIES;

            let urlBase = this.configuration.url_base;
            let apiBase = this.configuration.api_base
            if (urlBase && apiBase) {
                const departementsListPath = this.configuration!.path_list_departments || `/vitemadose/departements.json`;
                const infosDepartementPath = this.configuration!.path_data_department || `/vitemadose/{code}.json`;
                this._urlGenerator = {
                    listDepartements: () => `${urlBase}${departementsListPath}`,
                    infosDepartement: (codeDepartement) => `${urlBase}${infosDepartementPath.replace('{code}', codeDepartement)}`,
                    workshops: () => `${apiBase}`
                };
            }

            this.configurationSyncedPromise = Promise.resolve();
            return this.configurationSyncedPromise;
        }
    }

    async urlGenerator() {
        await this.configurationSyncedPromise;
        return this._urlGenerator! as DataUrlGenerator;
    }
}

export type DisclaimerSeverity = 'warning' | 'error';
