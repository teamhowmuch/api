import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUserOtpTable1651154013356 implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    q.query(`
        CREATE TABLE public.user_otp (
            id serial PRIMARY KEY,
            otp_hashed character varying NOT NULL,
            used boolean NOT NULL,
            created_at timestamp without time zone DEFAULT now() NOT NULL,
            updated_at timestamp without time zone DEFAULT now() NOT NULL,
            user_id integer NOT NULL REFERENCES public."user"(id)
        );
      `)
  }

  public async down(q: QueryRunner): Promise<void> {
    q.query(`DROP TABLE user_otp;`)
  }
}
