import { Entity, Column, PrimaryColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'

@Entity()
export class Company extends BaseEntity {
  @PrimaryColumn() id: string
  @Column() display_name_company: string

  @Column({ default: 0 }) bla_score: number
  @Column({ default: 0 }) equality_score: number
  @Column({ default: 0 }) fair_pay_score: number
  @Column({ default: 0 }) climate_score: number
  @Column({ default: 0 }) anti_weapons_score: number
  @Column({ default: 0 }) animal_score: number
  @Column({ default: 0 }) nature_score: number
  @Column({ default: 0 }) anti_tax_avoidance_Score: number
}
