import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm'

import { MerchantCategory } from './MerchantCategory'

@Entity()
export class Merchant {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  website?: string

  @Column({ nullable: true })
  logo?: string

  // -----
  // CA/UA
  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  // -----
  // Relations
  @ManyToOne(() => MerchantCategory, { cascade: true })
  @JoinColumn({ name: 'category_id' })
  category?: MerchantCategory

  @Column({ nullable: true })
  category_id?: number
}
