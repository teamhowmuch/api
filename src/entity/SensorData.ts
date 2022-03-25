import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from 'typeorm';

  import { Sensor} from "./Sensor"
  
  
  @Entity()
  export class SensorData {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(type => Sensor, sensor => sensor.data)
    sensor: Sensor;
  
    @Column()
    from: Date;

    @Column()
    to: Date;

    @Column()
    amount: number;

    @Column()
    source: string; //later verwijzen 

    @Column()
    metric: string;

    @Column({
        nullable: true
    })
    in:loterval: boolean;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  