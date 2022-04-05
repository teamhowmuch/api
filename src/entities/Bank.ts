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
  PrimaryColumn,
} from 'typeorm'
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
export class Bank {
  @PrimaryColumn()
  id: string

  @Column()
  name: string

  @Column()
  provider: 'nordigen'

  @Column()
  bic: string

  @Column()
  logo: string

  @Column()
  transaction_total_days: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
