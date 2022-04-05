import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'

export enum SourceType {
  TRANSACTION = 'TRANSACTION',
}

@Entity()
export class EmissionEvent {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'real' })
  co2eq_mean: number

  @Column({ nullable: true, type: 'real' })
  co2eq_min?: number

  @Column({ nullable: true, type: 'real' })
  co2eq_max?: number

  @Column({ enum: SourceType, type: 'enum' })
  source_type: SourceType

  @Column()
  source_id: string

  @Column({ type: 'json' })
  data: { [key: string]: any }

  @Column({ type: 'timestamp with time zone' })
  timestamp: Date

  // -----
  // Created + updated
  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  // -----
  // Relations
  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column()
  user_id: number
}
