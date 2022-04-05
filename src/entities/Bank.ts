import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm'

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
  provider: 'nordigen' | 'tink'

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
