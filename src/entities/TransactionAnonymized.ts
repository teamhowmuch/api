import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { Transaction } from './Transaction'

@Entity()
export class TransactionAnonymized extends BaseEntity {
  @OneToOne(() => Transaction) @JoinColumn({ name: 'transaction_id' }) transaction: Transaction
  @PrimaryColumn() transaction_id: string
  @Column({ type: 'json' }) raw_data: { [key: string]: any }
  @Column({ type: 'json' }) resolved_to: { [key: string]: any }
}
