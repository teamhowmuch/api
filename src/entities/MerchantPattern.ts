import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'

import { Merchant } from './Merchant'

@Entity()
export class MerchantPattern {
  @PrimaryColumn()
  name: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => Merchant, { cascade: true })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant

  @Column()
  merchant_id: number
}
