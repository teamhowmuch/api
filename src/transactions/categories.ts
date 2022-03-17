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
  transactionMatch?: string
  iconUrl?: string
}
export const knownMerchants: Readonly<KnownMerchant[]> = [
  {
    name: 'Shell',
    transactionMatch: 'shell',
    iconUrl:
      'https://upload.wikimedia.org/wikipedia/en/thumb/e/e8/Shell_logo.svg/1200px-Shell_logo.svg.png',
  },
] as const
export const knownMerchantsFlat = knownMerchants.map((el) => el.name)

export const debtorCategoryMap: Record<TransactionCategory, readonly string[]> = {
  [TransactionCategory.CARFUEL]: ['shell', 'tamoil', 'total', 'avia', 'esso'],
  [TransactionCategory.FLIGHTS]: ['transavia', 'klm', 'easyjet', 'ryanair', 'vueling'],
  [TransactionCategory.GROCERIES]: [
    'marqt',
    'albert heijn',
    'jumbo',
    'dirk',
    'ekodis',
    'ekoplaza',
    'odin',
    'vomar',
  ],
  [TransactionCategory.INSURANCE]: ['allianz', 'ohra', 'inshared', 'centraal beheer'],
  [TransactionCategory.OTHER]: [],
  [TransactionCategory.PRODUCTS]: ['coolblue', 'bol.com', 'praxis', 'gamma'],
  [TransactionCategory.RENT]: [],
  [TransactionCategory.TELECOMMUNICATION]: ['kpn', 't-mobile', 'ziggo'],
  [TransactionCategory.UNCATEGORISED]: [],
  [TransactionCategory.UTILIES_ENERGY]: [
    'greenchoice',
    'eneco',
    'essent',
    'vattenfall',
    'vandebron',
  ],
} as const
