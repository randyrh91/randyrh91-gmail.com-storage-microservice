import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class ImageMigration implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: 'image',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                    },
                    {
                        name: 'filename',
                        type: 'varchar',
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                    },
                    {
                        name: 'is_published',
                        type: 'boolean',
                    },
                    {
                        name: 'userId',
                        type: 'int',
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
        await queryRunner.query(`DROP TABLE image`);
    }

}
