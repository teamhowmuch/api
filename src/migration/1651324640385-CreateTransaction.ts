import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTransaction1651324640385 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE public.transaction (
                id character varying PRIMARY KEY,
                processed boolean NOT NULL,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL,
                bank_connection_id integer NOT NULL REFERENCES public.user_bank_connection(id),
                user_id integer NOT NULL REFERENCES public."user"(id)
            );
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        DROP TABLE public.transaction;
      `)
  }
}
