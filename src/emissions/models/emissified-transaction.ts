import { EnrichedTransaction } from "../../transaction/models/enriched-transaction";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EmissifiedTransaction extends EnrichedTransaction {
    emissions: number;
}
