import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EmissionEvent, SourceType } from '../entities/EmissionEvent'
import { FindOneOptions, Repository, UpdateResult } from 'typeorm'
import { SearchResults } from 'src/search/searchResults'
import { SearchInput } from 'src/search/searchInput'

@Injectable()
export class EmissionEventsService {
  constructor(
    @InjectRepository(EmissionEvent) private emissionEventRepo: Repository<EmissionEvent>,
  ) {}

  async find(userId: number) {
    return this.emissionEventRepo.find({ where: { user_id: userId }, order: { timestamp: 'DESC' } })
  }

  async list(searchInput: SearchInput, userId: number): Promise<SearchResults<EmissionEvent>> {
    const { limit, offset, orderByDirection, orderByField } = searchInput
    const builder = this.emissionEventRepo.createQueryBuilder('emission-events')
    builder.where('user_id = :userId', { userId: `${userId}` })

    if (orderByDirection && orderByField) {
      builder.orderBy(`${orderByField}`, `${orderByDirection}`)
    }
    if (limit) {
      builder.limit(limit)
    }
    if (offset) {
      builder.offset(offset)
    }

    const count = await builder.getCount()
    const data = await builder.getMany()
    return {
      count,
      data,
    } as SearchResults<EmissionEvent>
  }

  async findOne(options: FindOneOptions<EmissionEvent>): Promise<EmissionEvent> {
    return this.emissionEventRepo.findOne(options)
  }

  async create(
    userId: number,
    co2eq: number,
    sourceType: SourceType,
    sourceId: number | string,
    timestamp: Date,
    data: { [key: string]: any },
  ) {
    const entity = new EmissionEvent()
    entity.user_id = userId
    entity.co2eq_mean = co2eq
    entity.source_type = sourceType
    entity.source_id = sourceId + ''
    entity.timestamp = timestamp
    entity.data = data
    const res = await this.emissionEventRepo.save(entity)
    return res
  }

  async softDeleteOne(eventId: number): Promise<UpdateResult> {
    return await this.emissionEventRepo.softDelete(eventId)
  }
}
