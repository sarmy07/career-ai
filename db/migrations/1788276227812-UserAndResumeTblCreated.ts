import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAndResumeTblCreated1788276227812 implements MigrationInterface {
    name = 'UserAndResumeTblCreated1788276227812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."resume_status_enum" AS ENUM('uploaded', 'processing', 'analyzed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "resume" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "filename" character varying NOT NULL, "fileUrl" character varying NOT NULL, "filePublicId" character varying NOT NULL, "status" "public"."resume_status_enum" NOT NULL DEFAULT 'uploaded', "extractedText" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_7ff05ea7599e13fac01ac812e48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "refreshToken" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "resume" ADD CONSTRAINT "FK_6543e24d4d8714017acd1a1b392" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resume" DROP CONSTRAINT "FK_6543e24d4d8714017acd1a1b392"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "resume"`);
        await queryRunner.query(`DROP TYPE "public"."resume_status_enum"`);
    }

}
