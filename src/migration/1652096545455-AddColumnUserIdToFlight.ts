import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddColumnUserIdToFlight1652096545455 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `ALTER TABLE flight 
        ADD COLUMN user_id INTEGER NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE;
        
      ALTER TABLE flight 
        ADD COLUMN merchant_id INTEGER REFERENCES public.merchant(id) ON DELETE SET NULL;
        
      ALTER TABLE flight 
        ADD COLUMN amount_paid_eur FLOAT;`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
      ALTER TABLE flight DROP COLUMN user_id;
      ALTER TABLE flight DROP COLUMN merchant_id;
      ALTER TABLE flight DROP COLUMN amount_paid_eur;
    `)
  }
}
