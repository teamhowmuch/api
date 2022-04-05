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
  @ManyToOne(() => UserBankConnection, (bankConnection) => bankConnection, {
    nullable: false,
  })
  @JoinColumn({ name: 'bank_connection_id' })
  bank_connection: UserBankConnection

  @Column({ nullable: false })
  bank_connection_id: number

  // -----
  // Relations
  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column()
  user_id: number
}
