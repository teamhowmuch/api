import { FlightFare } from 'src/flights/models'
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Airport } from './Airport'

@Entity()
export class Flight {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'enum', enum: FlightFare })
  fare: FlightFare

  @Column({ type: 'int' })
  ticket_count: number

  @ManyToOne(() => Airport, { cascade: true })
  @JoinColumn({ name: 'from_airport_id' })
  from_airport: Airport

  @Column({ type: 'varchar', length: 3 })
  from_airport_id: string

  @ManyToOne(() => Airport, { cascade: true })
  @JoinColumn({ name: 'to_airport_id' })
  to_airport: Airport

  @Column({ type: 'varchar', length: 3 })
  to_airport_id: string

  @Column({ type: 'int' })
  distance: number

  @Column({ type: 'timestamp with time zone' })
  purchased_at: Date

  @Column({ type: 'timestamp with time zone', nullable: true })
  flight_at: Date

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
