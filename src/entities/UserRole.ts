import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { User } from './User'

export enum RoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
  CHATBOT = 'CHATBOT',
}

@Entity()
export class UserRole extends BaseEntity {
  @PrimaryColumn({ type: 'enum', enum: RoleEnum }) role: RoleEnum

  @ManyToOne(() => User, (user) => user.roles)
  @JoinColumn({ name: 'user_id' })
  user: User

  @PrimaryColumn() user_id: number
}
