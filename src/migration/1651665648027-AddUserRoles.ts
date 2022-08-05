import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserRoles1651665648027 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TYPE public.user_role_enum AS ENUM (
                'ADMIN',
                'USER',
                'CHATBOT'
            );    

            CREATE TABLE user_role (
                user_id INTEGER REFERENCES public."user"(id) ON DELETE CASCADE,
                role public.user_role_enum DEFAULT 'USER',
                created_at timestamp without time zone DEFAULT now() NOT NULL,
                updated_at timestamp without time zone DEFAULT now() NOT NULL,
                PRIMARY KEY (user_id, role)
            );
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        DROP TABLE user_role;
        DROP TYPE user_role_enum;
      `)
  }
}
