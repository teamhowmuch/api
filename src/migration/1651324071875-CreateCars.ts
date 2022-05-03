import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCars1651324071875 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TYPE public.car_fuel_type_simplified_enum AS ENUM (
            'PETROL',
            'DIESEL',
            'LPG',
            'ELECTRIC',
            'OTHER'
        );

        CREATE TABLE public.car (
            id serial PRIMARY KEY,
            license_plate character varying NOT NULL,
            brand character varying NOT NULL,
            type character varying NOT NULL,
            build_year character varying NOT NULL,
            fuel_types character varying NOT NULL,
            fuel_type_simplified public.car_fuel_type_simplified_enum,
            created_at timestamp without time zone DEFAULT now() NOT NULL,
            updated_at timestamp without time zone DEFAULT now() NOT NULL,
            user_id integer NOT NULL REFERENCES public."user"(id),
            UNIQUE(license_plate, user_id)
        );
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE public.car')
    await queryRunner.query('DROP TYPE public.car_fuel_type_simplified_enum')
  }
}
