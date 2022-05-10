import { Column, Entity, PrimaryColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'

@Entity()
export class TransactionAnonymized extends BaseEntity {
  @PrimaryColumn() id: number
  @Column({ type: 'json' }) raw_data: { [key: string]: any }
  @Column({ type: 'json' }) resolved_to: { [key: string]: any }
}
