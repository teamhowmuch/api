import { ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MerchantCategory } from 'src/entities/MerchantCategory'
import { Repository } from 'typeorm'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(MerchantCategory)
    private categoryRepo: Repository<MerchantCategory>,
  ) {}

  async findById(id: number) {
    return this.categoryRepo.findOne(id)
  }

  async create(name: string) {
    const existing = await this.categoryRepo.findOne({ name })
    if (existing) {
      return new ConflictException(`That category already exists. Category name must be unique.`)
    }

    const category = new MerchantCategory()
    category.name = name
    const res = await this.categoryRepo.save(category)
    return res
  }
}
