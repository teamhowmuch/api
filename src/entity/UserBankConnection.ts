import { Requisition } from 'src/bank-connections/nordigen.service';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity()
export class UserBankConnection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'nordigen' })
  provider: 'nordigen';

  @Column({
    type: 'jsonb',
  })
  requisition_data: Requisition;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  user: User;
}
