import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export interface OnboardingData {
  completed: boolean
  completed_at: Date
  timeTakenS: number
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column({ nullable: true })
  first_name: string

  @Column({ nullable: true })
  last_name: string

  @Column({ default: true })
  active: boolean

  @Column({ type: 'json', nullable: true })
  onboarding_data: OnboardingData

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}