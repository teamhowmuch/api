import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserChat1659699933017 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE user_chat (
            user_id INTEGER REFERENCES public."user"(id) ON DELETE CASCADE,
            data JSON,
            created_at timestamp without time zone DEFAULT now() NOT NULL,
            updated_at timestamp without time zone DEFAULT now() NOT NULL,
            PRIMARY KEY (user_id)
        );
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`DROP TABLE user_chat;`)
  }
}
