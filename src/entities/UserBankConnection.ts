import { AccountDetails } from 'src/bank-connections/models/AccountDetails'
import { Requisition } from 'src/bank-connections/nordigen.service'
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Bank } from './Bank'
import { User } from './User'

export enum RequisitionStatus {
  PREINITIAL = 'preinitial',
  INITIAL = 'initial',
  VALID = 'valid',
  BROKEN = 'broken',
  DELETED = 'deleted',
  EXPIRED = 'expired',
}

@Entity()
export class UserBankConnection {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: 'nordigen' })
  provider: 'nordigen'

  @Column({ type: 'jsonb' })
  requisition_data: Requisition

  @Column({ type: 'enum', enum: RequisitionStatus, default: RequisitionStatus.PREINITIAL })
  requisition_status: RequisitionStatus

  @Column({ nullable: true })
  requisition_expires_at?: Date

  @Column({ type: 'jsonb', nullable: true })
  account_details_data?: AccountDetails[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => Bank, (bank) => bank)
  @JoinColumn({ name: 'bank_id' })
  bank: Bank

  @Column()
  bank_id: string

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column()
  user_id: number
}