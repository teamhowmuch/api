export const EMAIL_TEMPLATES = {
  otp: 'd-1f7ccd35b08a4ae1abf3c0e11cdd62d0',
  chatResults: 'd-ee7182f37bcb493d87b606f5366ce099',
} as const

export type EmailTemplate = keyof typeof EMAIL_TEMPLATES
