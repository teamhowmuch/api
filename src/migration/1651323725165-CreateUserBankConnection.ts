import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserBankConnection1651323725165 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TYPE public.user_bank_connection_requisition_status_enum AS ENUM (
            'preinitial',
            'initial',
            'valid',
            'broken',
            'deleted',
            'expired'
        );

        CREATE TABLE public.bank (
            id character varying PRIMARY KEY,
            name character varying NOT NULL,
            provider character varying NOT NULL,
            bic character varying NOT NULL,
            logo character varying NOT NULL,
            transaction_total_days integer NOT NULL,
            created_at timestamp without time zone DEFAULT now() NOT NULL,
            updated_at timestamp without time zone DEFAULT now() NOT NULL
        );

        CREATE TABLE public.user_bank_connection (
            id serial PRIMARY KEY,
            provider character varying DEFAULT 'nordigen' :: character varying NOT NULL,
            requisition_data jsonb NOT NULL,
            requisition_status public.user_bank_connection_requisition_status_enum DEFAULT 'preinitial' :: public.user_bank_connection_requisition_status_enum NOT NULL,
            requisition_expires_at timestamp without time zone,
            account_details_data jsonb,
            created_at timestamp without time zone DEFAULT now() NOT NULL,
            updated_at timestamp without time zone DEFAULT now() NOT NULL,
            bank_id character varying NOT NULL REFERENCES public.bank(id),
            user_id integer NOT NULL REFERENCES public."user"(id)
        );
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        DROP TABLE public.user_bank_connection;
        DROP TYPE public.user_bank_connection_requisition_status_enum;
        DROP TABLE public.bank;
    `)
  }
}
