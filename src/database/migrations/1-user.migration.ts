import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UserMigration implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: 'user',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: 'user_name',
                        type: 'varchar',
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                    {
                        name: 'created_at',
                        type: 'datetime',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE user`);
    }
}
