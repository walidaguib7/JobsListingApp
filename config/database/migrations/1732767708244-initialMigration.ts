import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1732767708244 implements MigrationInterface {
    name = 'InitialMigration1732767708244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`userId\` int NOT NULL AUTO_INCREMENT, \`firstname\` varchar(255) NOT NULL, \`lastname\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NULL, \`passwordHash\` varchar(255) NOT NULL, \`isVerified\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`userId\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
