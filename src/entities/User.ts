import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Car } from './Car'
import { EmissionEvent } from './EmissionEvent'
import { UserBankConnection } from './UserBankConnection'
import { UserRole } from './UserRole'

export interface AnyObject {
  [key: string]: any
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column({ nullable: true })
  name: string

  @Column({ default: true })
  active: boolean

  @Column({ type: 'json', nullable: true })
  onboarding_data: AnyObject

  @Column({ type: 'json', nullable: true })
  journey_data: AnyObject

  @OneToMany(() => UserRole, (role) => role.user)
  roles: UserRole[]

  @OneToMany(() => UserBankConnection, (bankConnection) => bankConnection.user)
  bankConnections: UserBankConnection[]

  @OneToMany(() => Car, (car) => car.user)
  cars: Car[]

  @OneToMany(() => EmissionEvent, (emissionEvent) => emissionEvent.user)
  emissionEvents: EmissionEvent[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
