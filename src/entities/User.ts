import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export interface AnyObject {
  [key: string]: any
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column({ nullable: true })
  name: string

  @Column({ default: true })
  active: boolean

  @Column({ type: 'json', nullable: true })
  onboarding_data: AnyObject

  @Column({ type: 'json', nullable: true })
  journey_data: AnyObject

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
