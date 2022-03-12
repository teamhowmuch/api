import { Injectable } from '@nestjs/common'
import { Transaction } from '../bank-connections/models/transaction'
import { EnrichedTransaction } from './models/enriched-transaction'

@Injectable()
export class CleanService {
  async structure(data: Transaction): Promise<EnrichedTransaction> {
    return {}
  }
}
