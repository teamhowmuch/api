import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCarRawData1652947901733 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE car ADD COLUMN raw_data JSON;
        ALTER TABLE car ADD COLUMN last_change_of_ownership TIMESTAMP WITHOUT TIME ZONE;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE car DROP COLUMN last_change_of_ownership;
        ALTER TABLE car DROP COLUMN raw_data;
    `)
  }
}
