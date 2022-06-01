import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { BaseEntity } from './BaseEntity'
import { UserBankConnection } from './UserBankConnection'

export enum BankImportStatus {
  QUEUED = 'QUEUED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}

@Entity()
export class BankImport extends BaseEntity {
  @PrimaryGeneratedColumn() id: number
  @Column({ type: 'enum', enum: BankImportStatus, default: BankImportStatus.QUEUED })
  status: BankImportStatus

  @Column({ type: 'json' }) error: any

  @Column() priority: number

  @Column({ type: 'timestamp without time zone', nullable: true }) date_from: Date
  @Column({ type: 'timestamp without time zone', nullable: true }) date_to: Date

  @Column({ type: 'timestamp with time zone', nullable: true }) started_at: Date
  @Column({ type: 'timestamp with time zone', nullable: true }) completed_at: Date

  @ManyToOne(() => UserBankConnection)
  @JoinColumn({ name: 'user_bank_connection_id' })
  user_bank_connection: UserBankConnection
  @Column() user_bank_connection_id: number
}
