import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddBankConnectionFieldDeletedAt1654170172309 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE user_bank_connection ADD COLUMN deleted_at TIMESTAMP WITHOUT TIME ZONE;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        ALTER TABLE user_bank_connection DROP COLUMN deleted_at;
    `)
  }
}
