import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserTable1651153953410 implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    q.query(`
        CREATE TABLE "user" (
            id serial PRIMARY KEY,
            email character varying NOT NULL,
            name character varying,
            active boolean DEFAULT true NOT NULL,
            onboarding_data json,
            journey_data json,
            created_at timestamp without time zone DEFAULT now() NOT NULL,
            updated_at timestamp without time zone DEFAULT now() NOT NULL
        );       
        `)
  }

  public async down(q: QueryRunner): Promise<void> {
    q.query(`DROP TABLE "user"`)
  }
}
