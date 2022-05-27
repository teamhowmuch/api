import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { User } from './User'
import { UserBankConnection } from './UserBankConnection'

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryColumn() id: string

  @Column({ type: 'timestamp with time zone', nullable: true }) booking_date: Date
  @Column({ nullable: true }) amount: number
  @Column({ nullable: true }) currency: string

  @Column({ type: 'timestamp without time zone' }) imported_at: Date
  @Column({ type: 'timestamp without time zone' }) processed_at: Date

  @Column({ nullable: true }) debtor: string
  @Column({ nullable: true }) creditor: string
  @Column({ nullable: true }) remittance: string

  @Column({ nullable: true }) extracted_from_account_iban: string
  @Column({ nullable: true }) extracted_from_account_display: string

  @Column({ type: 'json', nullable: true }) raw_data: { [key: string]: any }

  // -----
  // Relations
  @ManyToOne(() => UserBankConnection, (bankConnection) => bankConnection, {
    nullable: false,
  })
  @JoinColumn({ name: 'bank_connection_id' })
  bank_connection: UserBankConnection
  @Column({ nullable: false }) bank_connection_id: number

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User
  @Column()
  user_id: number
}
