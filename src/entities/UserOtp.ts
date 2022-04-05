import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { User } from './User'

@Entity()
export class UserOtp {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  otp_hashed: string

  @Column()
  used: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column()
  user_id: number
}
