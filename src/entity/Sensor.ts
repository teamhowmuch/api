import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from "./User"
import { SensorData} from "./SensorData"


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

  @ManyToOne(type => User, user => user.sensors)
  user: User

  @OneToMany(type => SensorData, data => data.sensor)
  //@JoinColumn()
  data: SensorData[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
