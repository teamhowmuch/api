import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
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

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
