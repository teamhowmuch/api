import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from './BaseEntity'

import { MerchantCategory } from './MerchantCategory'
import { MerchantTransactionSearchPattern } from './MerchantTransactionSearchPattern'

@Entity()
export class Merchant extends BaseEntity {
  @PrimaryGeneratedColumn() id: number

  @Column() name: string
  @Column({ nullable: true }) website?: string
  @Column({ nullable: true }) logo?: string

  // -----
  // Relations
  @ManyToOne(() => MerchantCategory, { cascade: true })
  @JoinColumn({ name: 'category_id' })
  category?: MerchantCategory

  @Column({ nullable: true })
  category_id?: number

  @OneToMany(() => MerchantTransactionSearchPattern, (pattern) => pattern.merchant)
  patterns: MerchantTransactionSearchPattern[]
}
