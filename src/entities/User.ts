import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { UserChat } from './UserChat'
import { UserRole } from './UserRole'

export interface AnyObject {
  [key: string]: any
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number
  @Column() email: string
  @Column({ nullable: true }) name: string
  @Column({ default: true }) active: boolean
  @Column({ nullable: true }) is_beta_tester: boolean
  @Column({ default: false }) is_anonymous: boolean

  @Column({ type: 'json', nullable: true }) onboarding_data: AnyObject
  @Column({ type: 'json', nullable: true }) journey_data: AnyObject

  @Column({ nullable: true }) email_change_request?: string
  @Column({ nullable: true }) email_change_request_at?: Date
  @Column({ nullable: true }) email_change_request_otp?: string

  @Column({ default: 0 }) equality_score: number
  @Column({ default: 0 }) fair_pay_score: number
  @Column({ default: 0 }) climate_score: number
  @Column({ default: 0 }) anti_weapons_score: number
  @Column({ default: 0 }) animal_score: number
  @Column({ default: 0 }) nature_score: number
  @Column({ default: 0 }) anti_tax_avoidance_score: number

  @OneToMany(() => UserRole, (role) => role.user) roles: UserRole[]
  @OneToMany(() => UserChat, (role) => role.user) chats: UserChat[]
}
