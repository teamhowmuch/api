import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm'
import { User } from './User'
import { UserBankConnection } from './UserBankConnection'

@Entity()
export class Transaction {
  @PrimaryColumn()
  id: string

  @Column()
  processed: boolean

  // -----
  // Created + updated
  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  // -----
  // Relations
  @ManyToOne((type) => UserBankConnection, (bankConnection) => bankConnection, {
    nullable: false,
  })
  @JoinColumn({ name: 'bankConnectionId' })
  bankConnection: UserBankConnection

  @Column({ nullable: false })
  bankConnectionId: number

  // -----
  // Relations
  @ManyToOne((type) => User, (user) => user)
  @JoinColumn({ name: 'userId' })
  user: User

  @Column()
  userId: number
}
