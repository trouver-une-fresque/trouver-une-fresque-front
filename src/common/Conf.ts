export type Atelier = {
  // Should be the same than PLATEFORMES' key
  code: string
  logo: string
  nom: string
  // Should we do promotion of this plateform ? for example on home screen ?
  // (typically, it may be not a good idea to promote the platform while JSON is not producing data for it yet)
  promoted: boolean
  website: string
  // Used for specific styling on logos, see for example _searchAppointment.scss
  styleCode: string
}

export const ATELIERS: Record<number, Atelier> = {
  600: {
    code: '2030Glorieuses',
    logo: '/assets/images/logo/logo_2030Glorieuses.webp',
    nom: 'Atelier 2030 Glorieuses',
    promoted: true,
    website: 'https://www.2030glorieuses.org/',
    styleCode: '_atelier2030Glorieuses',
  },
  500: {
    code: 'FresqueFrontieresPlanetaires',
    logo: '/assets/images/logo/logo_FDFP.webp',
    nom: 'Fresque des frontières planétaires',
    promoted: true,
    website: 'https://fresquefrontieresplanetaires.earth/',
    styleCode: '_fresqueFrontieresPlanetaires',
  },
  501: {
    code: 'HorizonsDecarbones',
    logo: '/assets/images/logo/logo_HD.webp',
    nom: 'Atelier Horizons Décarbonés',
    promoted: true,
    website: 'https://www.horizons-decarbones.earth/',
    styleCode: '_horizonsDecarbones',
  },
  300: {
    code: 'FresqueEcoCirculaire',
    logo: '/assets/images/logo/logo_fresqueEcoCirculaire.webp',
    nom: "Fresque de l'économie circulaire",
    promoted: true,
    website: 'https://www.lafresquedeleconomiecirculaire.com/',
    styleCode: '_fresqueEcoCirc',
  },
  200: {
    code: 'FresqueClimat',
    logo: '/assets/images/logo/logo_fresqueClimat.png',
    nom: 'Fresque du Climat',
    promoted: true,
    website: 'https://fresqueduclimat.org/',
    styleCode: '_fresqueClimat',
  },
  100: {
    code: '2tonnes',
    logo: '/assets/images/logo/logo_2tonnes.webp',
    nom: '2tonnes',
    promoted: true,
    website: 'https://www.2tonnes.org/',
    styleCode: '_2tonnes',
  },
  2: {
    code: 'FresqueBiodiversite',
    logo: '/assets/images/logo/logo_fresqueBiodiversite.svg',
    nom: 'Fresque de la Biodiversité',
    promoted: true,
    website: 'https://www.fresquedelabiodiversite.org/',
    styleCode: '_fresqueBiodiversite',
  },
  1: {
    code: 'FresqueOceane',
    logo: '/assets/images/logo/logo_fresqueOceane.webp',
    nom: 'Fresque Océane',
    promoted: true,
    website: 'https://www.fresqueoceane.org/',
    styleCode: '_fresqueOceane',
  },
  4: {
    code: 'FresqueAgriAlim',
    logo: '/assets/images/logo/logo_fresqueAgriAlim.webp',
    nom: "Fresque Agri'Alim",
    promoted: true,
    website: 'https://fresqueagrialim.org/',
    styleCode: '_fresqueAgriAlim',
  },
  3: {
    code: 'FresqueNumerique',
    logo: '/assets/images/logo/logo_fresqueNumerique.png',
    nom: 'Fresque du Numérique',
    promoted: true,
    website: 'https://www.fresquedunumerique.org/',
    styleCode: '_fresqueNumerique',
  },
  0: {
    code: 'FresqueNouveauxRecits',
    logo: '/assets/images/logo/logo_fresqueNouveauxRecits.webp',
    nom: 'Fresque des Nouveaux Récits',
    promoted: true,
    website: 'https://www.fresquedesnouveauxrecits.org/',
    styleCode: '_fresqueNouveauRevits',
  },
  7: {
    code: 'FresqueMobilite',
    logo: '/assets/images/logo/logo_fresqueMobilite.png',
    nom: 'Fresque de la Mobilité',
    promoted: true,
    website: 'https://fresquedelamobilite.org/',
    styleCode: '_fresqueMobilite',
  },
  5: {
    code: 'FresqueAlimentation',
    logo: '/assets/images/logo/logo_fresqueAlimentation.svg',
    nom: "Fresque de l'Alimentation",
    promoted: true,
    website: 'https://fresquealimentation.org/',
    styleCode: '_fresqueAlimentation',
  },
  9: {
    code: 'OGRE',
    logo: '/assets/images/logo/logo_OGRE.png',
    nom: 'OGRE',
    promoted: true,
    website: 'https://atelierogre.org/',
    styleCode: '_logoOGRE',
  },
  6: {
    code: 'FresqueConstruction',
    logo: '/assets/images/logo/logo_fresqueConstruction.webp',
    nom: 'Fresque de la Construction',
    promoted: true,
    website: 'https://www.fresquedelaconstruction.org/',
    styleCode: '_fresqueConstruction',
  },
  8: {
    code: 'FresqueSexisme',
    logo: '/assets/images/logo/logo_fresqueSexisme.png',
    nom: 'Fresque du Sexisme',
    promoted: true,
    website: 'https://fresque-du-sexisme.org/',
    styleCode: '_fresqueSexisme',
  },
  10: {
    code: 'AtelierNosViesBasCarbone',
    logo: '/assets/images/logo/logo_NVBC.webp',
    nom: 'Nos Vies Bas Carbone',
    promoted: true,
    website: 'https://www.nosviesbascarbone.org/',
    styleCode: '_atelierNVBC',
  },
  11: {
    code: 'FresqueDeLeau',
    logo: '/assets/images/logo/logo_fresqueDeLeau.webp',
    nom: "Fresque de l'Eau",
    promoted: true,
    website: 'https://www.eaudyssee.org/',
    styleCode: '_fresqueDeLeau',
  },
  12: {
    code: 'FutursProches',
    logo: '/assets/images/logo/logo_FutursProches.webp',
    nom: 'Futurs Proches',
    promoted: true,
    website: 'https://futursproches.com/',
    styleCode: '_futursProches',
  },
  13: {
    code: 'FresqueDiversite',
    logo: '/assets/images/logo/logo_fresqueDiversite.webp',
    nom: 'Fresque de la Diversité',
    promoted: true,
    website: 'https://fresquedeladiversite.org/',
    styleCode: '_fresqueDiversite',
  },
  14: {
    code: 'FresqueDuTextile',
    logo: '/assets/images/logo/logo_FresqueTextile.webp',
    nom: 'Fresque du Textile',
    promoted: true,
    website: 'https://greendonut.org/',
    styleCode: '_fresqueTextile',
  },
  15: {
    code: 'FresqueDesDechets',
    logo: '/assets/images/logo/logo_greenDonut.webp',
    nom: 'Fresque des Déchets',
    promoted: false,
    website: 'https://greendonut.org/',
    styleCode: '_fresqueDechets',
  },
  16: {
    code: 'PuzzleClimat',
    logo: '/assets/images/logo/logo_puzzleClimat.webp',
    nom: 'Puzzle Climat',
    promoted: true,
    website: 'https://www.puzzleclimat.org/',
    styleCode: '_puzzleClimat',
  },
  17: {
    code: 'FresqueFinance',
    logo: '/assets/images/logo/logo_fresqueFinance.webp',
    nom: 'Fresque de la finance',
    promoted: true,
    website: '',
    styleCode: '_fresqueFinance',
  },
  18: {
    code: 'FresqueRSE',
    logo: '/assets/images/logo/logo_FresqueRSE.webp',
    nom: 'Fresque de la RSE',
    promoted: true,
    website: 'https://fresquedelarse.org/',
    styleCode: '_fresqueRSE',
  },
}

export type CodeDepartement = string

export type ISODateString = string

export type Workshop = {
  address: string
  city: string
  department: CodeDepartement
  description: string
  end_date: ISODateString
  full_location: string
  kids: boolean
  latitude: number
  longitude: number
  location_name: string
  online: boolean
  scrape_date: ISODateString
  sold_out: boolean
  source_link: string
  start_date: ISODateString
  tickets_link: string
  title: string
  training: boolean
  workshop_type: number
  zip_code: string
}

export type Coordinates = { latitude: number; longitude: number }
export type Location = Coordinates & { city: string; cp: string }

export type WorkshopsParDepartement = {
  workshopsDisponibles: Workshop[]
  codeDepartements: CodeDepartement[]
  derniereMiseAJour: ISODateString
}

export type WorkshopsAffichableAvecDistance = Workshop & {
  distance: number | undefined
}
export type WorkshopsAvecDistanceParDepartement = {
  workshopsMatchantCriteres: WorkshopsAffichableAvecDistance[]
  workshopsDisponibles: WorkshopsAffichableAvecDistance[]
  codeDepartements: CodeDepartement[]
  derniereMiseAJour: ISODateString
}
