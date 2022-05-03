import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAirportFlights1651571840242 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE public.airport (
                iata_id VARCHAR(3) PRIMARY KEY,
                name VARCHAR NOT NULL,
                lat FLOAT8 NOT NULL,
                long FLOAT8 NOT NULL,
                country_code_iso_2 VARCHAR(2) NOT NULL,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL
            );

            CREATE TYPE public.flight_fare_enum AS ENUM (
              'ECONOMY',
              'BUSINESS',
              'FIRST'
            );

            CREATE TABLE public.flight (
                id SERIAL PRIMARY KEY,
                ticket_count INT NOT NULL,
                fare public.flight_fare_enum,
                from_airport_id VARCHAR(3) REFERENCES public.airport(iata_id),
                to_airport_id VARCHAR(3) REFERENCES public.airport(iata_id),
                distance int NOT NULL,
                purchased_at TIMESTAMP WITH TIME ZONE NOT NULL,
                flight_at  TIMESTAMP WITH TIME ZONE,
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL
            );
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        DROP TABLE public.flight;
        DROP TYPE public.flight_fare_enum;
        DROP TABLE public.airport;
    `)
  }
}
