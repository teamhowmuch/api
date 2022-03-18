import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sensorname: string;

  @Column()
  sensortype: string;

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
