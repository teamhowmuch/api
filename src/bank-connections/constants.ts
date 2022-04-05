export const SUPPORTED_BANKS = [
  'ABNAMRO_ABNANL2A',
  'ASN_BANK_ASNBNL21',
  'ING_INGBNL2A',
  'PAYPAL_PPLXLULL',
  'RABOBANK_RABONL2U',
  'REGIOBANK_RBRBNL21',
  'SNS_BANK_SNSBNL2A',
  'TRIODOS_TRIONL2U',
  'SANDBOXFINANCE_SFIN0000',
] as const
export type SupportedBank = typeof SUPPORTED_BANKS[number]
