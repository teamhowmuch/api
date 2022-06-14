export enum TransactionCategory {
  CARFUEL = 'carfuel',
  FLIGHTS = 'flights',
  GROCERIES = 'groceries',
  INSURANCE = 'insurance',
  OTHER = 'other',
  PRODUCTS = 'products',
  RENT = 'rent',
  TELECOMMUNICATION = 'telecommunication',
  UNCATEGORISED = 'uncategorised',
  UTILIES_ENERGY = 'utilities',
}

export interface KnownMerchant {
  name: string
  searchPattern: string
  category: TransactionCategory
  iconUrl?: string
}

export const knownMerchants: KnownMerchant[] = [
  {
    name: 'Albert Heijn',
    searchPattern: 'albert heijn',
    category: TransactionCategory.GROCERIES,
    iconUrl: 'https://pbs.twimg.com/profile_images/1092811623167942656/J6_HT2vZ_400x400.jpg',
  },
  {
    name: 'Shell',
    searchPattern: 'shell',
    category: TransactionCategory.CARFUEL,
    iconUrl: 'https://1000logos.net/wp-content/uploads/2017/06/Shell-Logo.png',
  },
  {
    name: 'Texaco',
    searchPattern: 'texaco',
    category: TransactionCategory.CARFUEL,
    iconUrl: 'https://1000logos.net/wp-content/uploads/2020/09/Texaco-Emblem.jpg',
  },
  {
    name: 'Esso',
    searchPattern: 'esso',
    category: TransactionCategory.CARFUEL,
    iconUrl: 'https://1000logos.net/wp-content/uploads/2021/03/Esso-logo-1536x1024.png',
  },
  {
    name: 'BP',
    searchPattern: 'bp ',
    category: TransactionCategory.CARFUEL,
    iconUrl: 'https://1000logos.net/wp-content/uploads/2016/10/BP-Logo-1024x640.png',
  },
  {
    name: 'Tamoil',
    searchPattern: 'tamoil',
    category: TransactionCategory.CARFUEL,
    iconUrl: 'https://tamoil.nl/wp-content/uploads/2017/10/Tamoil-logo-hoge-resolutie.jpg',
  },
  {
    name: 'TinQ',
    searchPattern: 'tinq',
    category: TransactionCategory.CARFUEL,
    iconUrl: 'https://travelcard.nl/wp-content/uploads/2017/11/17.-tinq.png',
  },
  {
    name: 'Total',
    searchPattern: 'total',
    category: TransactionCategory.CARFUEL,
    iconUrl: 'https://www.tariefcoach.nl/upload/pdf/2018/07/Total-logo-1024x768.png',
  },
  {
    name: 'Avia',
    searchPattern: 'avia ',
    category: TransactionCategory.CARFUEL,
    iconUrl: 'https://www.loyaltyfacts.nl/wp-content/uploads/2018/03/Avia-logo.jpg',
  },
  {
    name: 'Garage Lux (shell)',
    searchPattern: 'garage lux',
    category: TransactionCategory.CARFUEL,
    iconUrl: 'https://1000logos.net/wp-content/uploads/2017/06/Shell-Logo.png',
  },
  {
    name: 'Berkman Breda',
    searchPattern: 'berkman breda',
    category: TransactionCategory.CARFUEL,
    iconUrl: 'https://www.berkman.nl/wp-content/themes/berkman/images/berkman_logo.png',
  },
  {
    name: 'Esso Kalix Berna',
    searchPattern: 'vissers oosterhout',
    category: TransactionCategory.CARFUEL,
    iconUrl: 'https://1000logos.net/wp-content/uploads/2021/03/Esso-logo-1536x1024.png',
  },
  {
    name: 'Q8',
    searchPattern: 'q8',
    category: TransactionCategory.CARFUEL,
    iconUrl: 'https://www.case.vlaanderen/pictures/cms/q8/q8-logo.jpg',
  },
  {
    name: 'Aral',
    searchPattern: 'aral',
    category: TransactionCategory.CARFUEL,
    iconUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Aral_Logo.svg/120px-Aral_Logo.svg.png',
  },
  {
    name: 'Gabriëls',
    searchPattern: 'gabriels',
    category: TransactionCategory.CARFUEL,
    iconUrl:
      'https://www.servicestationmagazine.be/sites/default/files/styles/nieuws_teaserfoto/public/nieuws/gabriels1.jpg?itok=vMEXwCNM',
  },
  {
    name: 'Scheiwijk',
    searchPattern: 'scheiwijk',
    category: TransactionCategory.CARFUEL,
    iconUrl:
      'https://pbs.twimg.com/profile_images/2818949973/981c08dc0e89ebf35e651bca4763e190_400x400.png',
  },
  {
    name: 'SuperTank',
    searchPattern: 'supertank',
    category: TransactionCategory.CARFUEL,
    iconUrl:
      'https://www.dierenambulancehoorn.nl/wp-content/uploads/2020/03/LOGO_SuperTank_4kant.png',
  },
  {
    name: 'Developer gas station',
    searchPattern: 'alderaan coffe',
    category: TransactionCategory.CARFUEL,
    iconUrl: 'https://www.case.vlaanderen/pictures/cms/q8/q8-logo.jpg',
  },
]
