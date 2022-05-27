import { MigrationInterface, QueryRunner } from 'typeorm'

export class addTransactionRawData1653647762120 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DROP TABLE IF EXISTS public."transaction_anonymized";
            DROP TABLE IF EXISTS public."transaction";

            CREATE TABLE public.transaction (
              id character varying PRIMARY KEY,

              imported_at TIMESTAMP WITHOUT TIME ZONE,
              processed_at TIMESTAMP WITHOUT TIME ZONE,

              booking_date TIMESTAMP WITH TIME ZONE,
              value_date   TIMESTAMP WITH TIME ZONE,

              amount   FLOAT,
              currency VARCHAR(3),

              debtor     VARCHAR,
              creditor   VARCHAR,
              remittance VARCHAR,

              extracted_from_account_iban VARCHAR,
              extracted_from_account_display VARCHAR,
            
              raw_data JSON,

              created_at timestamp without time zone DEFAULT now() NOT NULL,
              updated_at timestamp without time zone DEFAULT now() NOT NULL,

              bank_connection_id integer NOT NULL REFERENCES public.user_bank_connection(id),
              user_id integer NOT NULL REFERENCES public."user"(id)
            );
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(``)
  }
}
