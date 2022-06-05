import { MigrationInterface, QueryRunner } from 'typeorm'

export class AlterTableEmissionEventsAddDeletedAt1654446354634 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE emission_event ADD COLUMN deleted_at TIMESTAMP WITHOUT TIME ZONE;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE emission_event DROP COLUMN deleted_at;
    `)
  }
}
