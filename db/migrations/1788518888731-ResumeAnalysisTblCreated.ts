import { MigrationInterface, QueryRunner } from "typeorm";

export class ResumeAnalysisTblCreated1788518888731 implements MigrationInterface {
    name = 'ResumeAnalysisTblCreated1788518888731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "resume_analysis" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "skills" jsonb NOT NULL, "experienceSummary" text NOT NULL, "strengths" jsonb NOT NULL, "weakness" jsonb NOT NULL, "missingSkills" jsonb NOT NULL, "score" integer NOT NULL, "suggestions" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bdb67cc6d183f83ea737231a8f3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "resume_analysis"`);
    }

}
