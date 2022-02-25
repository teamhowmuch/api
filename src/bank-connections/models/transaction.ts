export interface Transaction {
  endToEndId?: string // optional Id
  additionalInformation?: string //	Max500Text	Optional	Might be used by the financial institution to transport additional transaction related information
  balanceAfterTransaction?: string //    	Balance	Optional	This is the balance after this transaction. Recommended balance type is interimBooked.
  bankTransactionCode?: string //    	Bank Transaction Code	Optional 	Bank transaction code as used by the financial institution and using the sub elements of this structured code defined by ISO20022. For standing order reports the following codes are applicable: "PMNT-ICDT-STDO" for credit transfers, "PMNT-IRCT-STDO" for instant credit transfers, "PMNT-ICDT-XBST" for cross-border credit transfers, "PMNT-IRCT-XBST" for cross-border real time credit transfers, "PMNT-MCOP-OTHR" for specific standing orders which have a dynamical amount to move left funds e.g. on month end to a saving account
  bookingDate?: string //    	ISODate	Optional	The Date when an entry is posted to an account on the financial institutions books.
  checkId?: string //	Max35Text	Optional	Identification of a Cheque
  creditorAccount?: string //	Account Reference	Conditional
  creditorAgent?: string //    	BICFI	Optional
  creditorId?: string //	Max35Text	Optional	Identification of Creditors, e.g. a SEPA Creditor ID
  creditorName?: string //	Max70Text	Optional	Name of the creditor if a "Debited" transaction
  currencyExchange?: string //	Array of Report Exchange Rate	Optional
  debtorAccount?: string //    	Account Reference	Conditional
  debtorAgent?: string //	BICFI	Optional
  debtorName?: string //	Max70Text	Optional	Name of the debtor if a "Credited" transaction
  entryReference?: string //	Max35Text	Optional	Is the identification of the transaction as used for reference given by financial institution.
  mandateId?: string //	Max35Text	Optional	Identification of Mandates, e.g. a SEPA Mandate ID
  proprietaryBank?: string // TransactionCode    	Max35Text	Optional	Proprietary bank transaction code as used within a community or within an financial institution
  purposeCode?: string //	Purpose Code    	Conditional
  remittanceInformationStructured?: string //	Max140Text	Optional	Reference as contained in the structured remittance reference structure
  remittanceInformationStructuredArray?: string // StructuredArray	Array of Remittance	Optional	Reference as contained in the structured remittance reference structure
  remittanceInformationUnstructured?: string // Unstructured    	Max140Text	Optional
  remittanceInformationUnstructuredArray?: string // UnstructuredArray    	Array of Max140Text    	Optional
  transactionAmount: {
    currency: string
    amount: number
  } //	Amount		The amount of the transaction as billed to the account.
  transactionId?: string //	String	Optional	Unique transaction identifier given by financial institution
  ultimateCreditor?: string //    	Max70Text	Optional
  ultimateDebtor?: string //	Max70Text	Optional
  valueDate?: string //
}
