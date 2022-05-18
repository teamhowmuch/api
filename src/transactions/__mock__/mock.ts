export const mocks: { name: string; transaction: any }[] = [
  {
    name: 'Albert Heijn',
    transaction: {
      bankTransactionCode: 'PMNT-CCRD-POSD',
      bookingDate: '2022-01-09',
      endToEndId: 'NOT_PROVIDED',
      'entryRefer ence': '20220109-40581732',
      proprietaryBankTransactionCode: 'FBEA',
      remittanceInformationUnstructured:
        'ALBERT HEIJN  1649    >LEIDEN    9.01.2022 13U39 KV005 C8Q539   MCC:5411 Contactloze betaling NLNEDER LAND',
      transactionAmount: { amount: '-4.63', currency: 'EUR' },
      transactionId: 'K4P0QO/203012',
      valueDate: '2022-01-09',
      cleaning: { merchantName: null, transactionCode: 'PAYMENT' },
      enrichment: {
        contacts: { addressUnstructured: null, phone: null, title: null },
        description: { subtitle: null, summary: null },
        logo: null,
        name: null,
        website: null,
      },
      categorisation: { categoryId: 4, categoryTitle: 'Food and Dr ink' },
    },
  },

  {
    name: 'Berkman Breda',
    transaction: {
      bookingDate: '2021-08-13',
      proprietaryBankTransactionCode: '426',
      remittanceInformationUnstructuredArray: [
        'BEA   NR:QL39XZ   13.08.21/08.13',
        'Berkman Breda,PAS101',
        'BREDA',
      ],
      transactionAmount: { amount: '-44.42', currency: 'EUR' },
      cleaning: {
        merchantName: 'berkman breda pas101 breda',
        transactionCode: 'OTHER',
      },
      enrichment: {
        contacts: { addressUnstructured: null, phone: null, title: null },
        description: { subtitle: null, summary: null },
        logo: null,
        name: null,
        website: null,
      },
      categorisation: { categoryId: 99, categoryTitle: 'Other' },
    },
  },

  {
    name: 'Shell',
    transaction: {
      bookingDate: '2021-03-26',
      creditorName: 'Shell 5423',
      debtorAccount: {
        currency: 'EUR',
        iban: 'NL15RABO0142175013',
      },
      entryReference: '9029',
      remittanceInformationUnstructured: 'Betaalautomaat 13:47 pasnr. 020',
      transactionAmount: {
        amount: '-64.67',
        currency: 'EUR',
      },
      valueDate: '2021-03-26',
    },
  },
]
