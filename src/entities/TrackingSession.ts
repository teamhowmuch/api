import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { TrackingEvent } from './TrackingEvent'
import { User } from './User'

@Entity()
export class TrackingSession extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string

  @OneToMany(() => TrackingEvent, (event) => event.tracking_session)
  tracking_events: TrackingEvent[]

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User
  @Column({ nullable: true }) user_id?: number
}
