import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAnonymizedTransaction1652185029525 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE public."user" ADD COLUMN is_beta_tester BOOLEAN DEFAULT FALSE;

            CREATE TABLE public.transaction_anonymized (
                id SERIAL PRIMARY KEY,
                raw_data JSON,
                resolved_to JSON,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL
            );
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DROP TABLE public.transaction_anonymized;
            ALTER TABLE public."user" DROP COLUMN is_beta_tester;
        `)
  }
}
