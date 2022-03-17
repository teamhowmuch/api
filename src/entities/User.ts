import { FuelType } from 'src/products/carfuel/carfuel.service'
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export interface OnboardingData {
  completed: boolean
  completed_at: Date
  timeTakenS: number
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column({ default: true })
  active: boolean

  @Column({ type: 'json', nullable: true })
  onboarding_data: OnboardingData

  @Column({type: 'enum', enum: FuelType, nullable: true})
  car_fuel_type?: FuelType

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
