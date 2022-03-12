import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm'
import { Transaction } from './Transaction'

export interface ConfirmationData {
  [key: string]: any
}

export enum ConfirmationStatus {
  USER_CONFIRMED = 'user_confirmed',
  AUTO_CONFIRMED = 'auto_confirmed',
  CONFIRMATION_NEEDED = 'confirmation_needed',
  DISMISSED = 'dismissed',
}

@Entity()
export class TransactionConfirmation {
  @Column({ type: 'enum', enum: ConfirmationStatus, nullable: false })
  status: ConfirmationStatus

  @Column({ type: 'json' })
  data: ConfirmationData

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  // ----
  // Relations
  @OneToOne((type) => Transaction, {
    nullable: false,
  })
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction

  @PrimaryColumn()
  transactionId: string
}
