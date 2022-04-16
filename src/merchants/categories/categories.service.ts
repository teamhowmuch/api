import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MerchantCategory } from 'src/entities/MerchantCategory'
import { Repository } from 'typeorm'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(MerchantCategory)
    private categoryRepo: Repository<MerchantCategory>,
  ) {}

  async create(label: string) {
    const category = new MerchantCategory()
    category.label = label
    const res = await this.categoryRepo.save(category)
    return res
  }
}
