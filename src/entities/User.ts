import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Car } from './Car'
import { EmissionEvent } from './EmissionEvent'
import { UserBankConnection } from './UserBankConnection'
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
  @Column() is_beta_tester: boolean

  @Column({ type: 'json', nullable: true }) onboarding_data: AnyObject
  @Column({ type: 'json', nullable: true }) journey_data: AnyObject

  @OneToMany(() => UserRole, (role) => role.user) roles: UserRole[]
  @OneToMany(() => UserBankConnection, (bankConnection) => bankConnection.user)
  bankConnections: UserBankConnection[]

  @OneToMany(() => Car, (car) => car.user) cars: Car[]
  @OneToMany(() => EmissionEvent, (emissionEvent) => emissionEvent.user)
  emissionEvents: EmissionEvent[]
}
