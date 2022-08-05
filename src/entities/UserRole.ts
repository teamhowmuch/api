import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm'
import { User } from './User'

export enum RoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
  CHATBOT = 'CHATBOT',
}

@Entity()
export class UserRole {
  @PrimaryColumn({ type: 'enum', enum: RoleEnum })
  role: RoleEnum

  @ManyToOne(() => User, (user) => user.roles)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column()
  user_id: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
