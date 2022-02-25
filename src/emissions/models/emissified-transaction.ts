// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EmissifiedTransaction {
    additionalInformation: string;
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
    emissions: number;
}
