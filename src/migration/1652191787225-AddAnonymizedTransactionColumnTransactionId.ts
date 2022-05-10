import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAnonymizedTransactionColumnTransactionId1652191787225
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DELETE FROM transaction;
            DELETE FROM transaction_anonymized;
            DELETE FROM emission_event;
            ALTER TABLE transaction_anonymized ADD COLUMN transaction_id varchar REFERENCES public."transaction"(id);
            ALTER TABLE transaction_anonymized DROP CONSTRAINT transaction_anonymized_pkey;
            ALTER TABLE transaction_anonymized DROP COLUMN id;
            ALTER TABLE transaction_anonymized ADD PRIMARY KEY (transaction_id);
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            ALTER TABLE transaction_anonymized ADD COLUMN id SERIAL;
            ALTER TABLE transaction_anonymized DROP CONSTRAINT transaction_anonymized_pkey;
            ALTER TABLE transaction_anonymized DROP COLUMN transaction_id;
            ALTER TABLE transaction_anonymized ADD PRIMARY KEY (id);
        `)
  }
}
