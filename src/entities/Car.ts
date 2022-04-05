import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Unique,
  ManyToOne,
} from 'typeorm'
import { User } from './User'

import { FuelType } from 'src/products/carfuel/carfuel.service'

@Entity()
@Unique(['license_plate', 'user_id'])
export class Car {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  license_plate: string

  @Column()
  brand: string

  @Column()
  type: string

  @Column()
  build_year: string

  @Column()
  fuel_types: string

  @Column({ type: 'enum', enum: FuelType, nullable: true })
  fuel_type_simplified: FuelType

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column()
  user_id: number
}
