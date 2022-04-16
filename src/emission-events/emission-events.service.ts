import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EmissionEvent, SourceType } from 'src/entities/EmissionEvent'
import { FindOneOptions, Repository } from 'typeorm'

@Injectable()
export class EmissionEventsService {
  constructor(
    @InjectRepository(EmissionEvent) private emissionEventRepo: Repository<EmissionEvent>,
  ) {}

  async find(userId: number) {
    return this.emissionEventRepo.find({ where: { user_id: userId }, order: { timestamp: 'DESC' } })
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
    console.log('craeting new emission event with user id', userId)
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
}
