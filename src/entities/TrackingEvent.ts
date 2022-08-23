import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { TrackingSession } from './TrackingSession'
import { User } from './User'

@Entity()
export class TrackingEvent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string

  @Column() source: string
  @Column({ nullable: true }) page_title: string
  @Column({ nullable: true }) url: string
  @Column({ nullable: true }) environment: string

  @Column() action: string
  @Column({ nullable: true }) category: string

  @Column({ type: 'json', nullable: true }) data: any

  @ManyToOne(() => TrackingSession)
  @JoinColumn({ name: 'tracking_session_id' })
  tracking_session: TrackingSession
  @Column() tracking_session_id: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User
  @Column({ nullable: true }) user_id?: number
}
