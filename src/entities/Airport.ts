import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm'

@Entity()
export class Airport {
  @PrimaryColumn({ type: 'varchar', length: '3' })
  iata_id: string

  @Column()
  name: string

  @Column({ type: 'float8' })
  lat: number

  @Column({ type: 'float8' })
  long: number

  @Column({ type: 'varchar', length: 2 })
  country_code_iso_2: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
