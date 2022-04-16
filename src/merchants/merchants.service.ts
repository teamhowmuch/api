import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Merchant } from 'src/entities/Merchant'
import { Repository } from 'typeorm'

@Injectable()
export class MerchantsService {
  constructor(@InjectRepository(Merchant) private merchantRepo: Repository<Merchant>) {}

  async create(name: string) {
    const merchant = new Merchant()
    merchant.name = name
    return this.merchantRepo.save(merchant)
  }
}
