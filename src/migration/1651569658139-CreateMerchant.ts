import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMerchant1651569658139 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE public.merchant_category (
            id serial PRIMARY KEY,
            name varchar NOT NULL UNIQUE,
            description varchar,
            created_at timestamp without time zone DEFAULT now() NOT NULL,
            updated_at timestamp without time zone DEFAULT now() NOT NULL
        );  

        CREATE TABLE public.merchant (
            id serial PRIMARY KEY,
            name character varying NOT NULL UNIQUE,
            website character varying,
            logo character varying,
            created_at timestamp without time zone DEFAULT now() NOT NULL,
            updated_at timestamp without time zone DEFAULT now() NOT NULL,
            category_id integer NOT NULL REFERENCES public.merchant_category(id)
        );

        CREATE TABLE public.merchant_transaction_search_pattern (
            pattern varchar PRIMARY KEY,
            created_at timestamp without time zone DEFAULT now() NOT NULL,
            updated_at timestamp without time zone DEFAULT now() NOT NULL,
            merchant_id integer NOT NULL REFERENCES public.merchant(id)
        );

        CREATE TABLE public.merchant_bank_account (
            iban varchar PRIMARY KEY,
            created_at timestamp without time zone DEFAULT now() NOT NULL,
            updated_at timestamp without time zone DEFAULT now() NOT NULL,
            merchant_id integer NOT NULL REFERENCES public.merchant(id)
        );
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        DROP TABLE public.merchant_bank_account;
        DROP TABLE public.merchant_transaction_search_pattern;
        DROP TABLE public.merchant;
        DROP TABLE public.merchant_category;
    `)
  }
}
