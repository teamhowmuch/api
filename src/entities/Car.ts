import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, Unique, ManyToOne } from 'typeorm'
import { User } from './User'

import { FuelType } from '../products/carfuel/carfuel.service'
import { BaseEntity } from './BaseEntity'

@Entity()
@Unique(['license_plate', 'user_id'])
export class Car extends BaseEntity {
  @PrimaryGeneratedColumn() id: number
  @Column() license_plate: string
  @Column() brand: string
  @Column() type: string
  @Column() build_year: string
  @Column({ type: 'timestamp without time zone' }) last_change_of_ownership: Date
  @Column({ type: 'json' }) raw_data: any
  @Column() fuel_types: string
  @Column({ type: 'enum', enum: FuelType, nullable: true }) fuel_type_simplified: FuelType
  @ManyToOne(() => User, { cascade: true }) @JoinColumn({ name: 'user_id' }) user: User
  @Column() user_id: number
}
