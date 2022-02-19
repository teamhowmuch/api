export interface Transaction {
  transactionId: string;
  transactionAmount: {
    currency: string;
    amount: number;
  };
  bankTransactionCode: string;
  bookingDate: Date;
  valueDate: Date;
  creditorName: string;
  remittanceInformationUnstructured: string;
}
