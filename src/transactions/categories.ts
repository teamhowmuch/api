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
export const knownMerchants: Readonly<KnownMerchant[]> = [
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
] as const
