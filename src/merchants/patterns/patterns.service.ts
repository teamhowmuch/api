import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Merchant } from 'src/entities/Merchant'
import { MerchantTransactionSearchPattern } from 'src/entities/MerchantTransactionSearchPattern'
import { Repository } from 'typeorm'

@Injectable()
export class PatternsService {
  constructor(
    @InjectRepository(MerchantTransactionSearchPattern)
    private patternRepo: Repository<MerchantTransactionSearchPattern>,
  ) {}

  async create(merchantId: Merchant['id'], pattern: string) {
    const existing = await this.patternRepo.findOne({ where: { pattern } })
    if (existing) {
      throw new ConflictException(
        `Merchant search pattern ${pattern} already exists for merchant ${existing.merchant_id}`,
      )
    }
    const e = new MerchantTransactionSearchPattern()
    e.merchant_id = merchantId
    e.pattern = pattern
    return this.patternRepo.save(e)
  }
}
