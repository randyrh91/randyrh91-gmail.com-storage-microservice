import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class HistoryMigration implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: 'history',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: 'userId',
                        type: 'int',
                    },
                    {
                        name: 'imageId',
                        type: 'int',
                    },
                    {
                        name: 'action',
                        type: 'varchar',
                    },
                    {
                        name: 'date',
                        type: 'datetime',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE history`);
    }

}
