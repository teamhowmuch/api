import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Merchant } from 'src/entities/Merchant'
import { Repository } from 'typeorm'
import { CategoriesService } from './categories/categories.service'

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant) private merchantRepo: Repository<Merchant>,
    private categoryService: CategoriesService,
  ) {}

  async list() {
    return this.merchantRepo.find()
  }

  async create(name: string, category_id: number) {
    const category = await this.categoryService.findById(category_id)
    if (!category) {
      throw new NotFoundException(`Category with ${category_id} does not exists`)
    }

    const existingMerchant = await this.merchantRepo.findOne({ where: { name } })
    console.log('existingMerchant', existingMerchant)
    if (existingMerchant) {
      throw new ConflictException('Merchant name must be unique')
    }

    const merchant = new Merchant()
    merchant.name = name
    merchant.category_id = category_id
    return this.merchantRepo.save(merchant)
  }
}
