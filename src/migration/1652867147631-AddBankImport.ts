import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddBankImport1652867147631 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TYPE public.bank_import_status AS ENUM (
                'QUEUED',
                'ACTIVE',
                'COMPLETED',
                'ERROR'
            );

            CREATE TABLE bank_import (
                id SERIAL PRIMARY KEY,
                
                status bank_import_status DEFAULT 'QUEUED',
                error JSON,

                priority INTEGER DEFAULT 1 NOT NULL,

                date_from TIMESTAMP WITHOUT TIME ZONE,
                date_to TIMESTAMP WITHOUT TIME ZONE,
                
                started_at TIMESTAMP WITHOUT TIME ZONE,
                completed_at TIMESTAMP WITHOUT TIME ZONE,
                
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL,

                user_bank_connection_id INTEGER NOT NULL REFERENCES user_bank_connection(id)
            )
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        DROP TABLE bank_import;
        DROP TYPE bank_import_status;
      `)
  }
}
