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
  OneToOne,
} from 'typeorm'
import { TransactionConfirmation } from './TransactionConfirmation'
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
  @PrimaryColumn()
  id: string

  // -----
  // Raw bank data
  @Column({
    type: 'jsonb',
  })
  bank_data: TransactionData

  // -----
  // Categorisation
  @Column({ type: 'enum', enum: TransactionCategory, nullable: true })
  category?: TransactionCategory

  @Column({ type: 'timestamp', nullable: true })
  categorized_at?: Date

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

  @OneToOne((type) => TransactionConfirmation, (confirmation) => confirmation.transactionId)
  confirmationId: number
}
