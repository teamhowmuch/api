import { Transaction as TransactionData } from 'src/bank-connections/models/transaction'
import { TransactionCategory } from 'src/transactions/categories'
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'
import { UserBankConnection } from './UserBankConnection'

export enum TransactionType {
  PAYMENT = 'payment',
  TRANSFER = 'transfer',
  REFUND = 'refund',
  ATM = 'atm',
  OTHER = 'other',
  UNTYPED = 'untyped',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  co2eq_mean: number

  @Column()
  co2eq_min: number

  @Column()
  co2eq_max: number

  @Column()
  source_type: 'transaction'

  @Column()
  source_id: string

  @Column({ type: 'timestamp with time zone' })
  event_timestamp: Date

  // -----
  // Created + updated
  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  // -----
  // Relations
  @ManyToOne(() => UserBankConnection, (bankConnection) => bankConnection.id, {
    nullable: false,
  })
  bankConnection: UserBankConnection

  // -----
  // Relations
  @ManyToOne((type) => User, (user) => user)
  @JoinColumn({ name: 'userId' })
  user: User

  @Column()
  userId: number
}
