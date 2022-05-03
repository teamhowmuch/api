import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateEmissionEvent1651324793541 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TYPE public.emission_event_source_type_enum AS ENUM (
                'TRANSACTION'
            );

            CREATE TABLE public.emission_event (
                id serial PRIMARY KEY,
                co2eq_mean real NOT NULL,
                co2eq_min real,
                co2eq_max real,
                source_type public.emission_event_source_type_enum NOT NULL,
                source_id character varying NOT NULL,
                data json NOT NULL,
                "timestamp" timestamp with time zone NOT NULL,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL,
                user_id integer NOT NULL REFERENCES public."user"(id)
            );
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DROP TABLE public.emission_event;
            DROP TYPE public.emission_event_source_type_enum;
        `)
  }
}
