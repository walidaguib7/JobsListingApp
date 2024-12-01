import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMediaUsersRelationship1733016679833 implements MigrationInterface {
    name = 'AddMediaUsersRelationship1733016679833'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "mediaId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_cd81db2b14bf99eaec0934d1f29" UNIQUE ("mediaId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_cd81db2b14bf99eaec0934d1f29" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_cd81db2b14bf99eaec0934d1f29"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_cd81db2b14bf99eaec0934d1f29"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "mediaId"`);
    }

}
