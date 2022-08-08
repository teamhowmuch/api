import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { User } from './User'

@Entity()
export class UserChat extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column({ type: 'json' }) data: any

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
  @Column() user_id: number
}
