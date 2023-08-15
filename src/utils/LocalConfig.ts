export type DataUrlGenerator = {
    listDepartements: () => string,
    infosDepartement: (codeDepartement: string) => string,
    creneauxQuotidiensDepartement: (codeDepartement: string) => string,
    workshops: () => string
};

export const GITHUB_DATA_URLS: DataUrlGenerator = {
    listDepartements: () => `https://raw.githubusercontent.com/CovidTrackerFr/vitemadose/data-auto/data/output/departements.json`,
    infosDepartement: (codeDepartement) => `https://raw.githubusercontent.com/CovidTrackerFr/vitemadose/data-auto/data/output/${codeDepartement}.json`,
    creneauxQuotidiensDepartement: (codeDepartement) => `https://raw.githubusercontent.com/CovidTrackerFr/vitemadose/data-auto/data/output/${codeDepartement}/creneaux-quotidiens.json`,
    workshops: () => `https://raw.githubusercontent.com/trouver-une-fresque/trouver-une-fresque-data/main/events_20230814_191030.json`
}
