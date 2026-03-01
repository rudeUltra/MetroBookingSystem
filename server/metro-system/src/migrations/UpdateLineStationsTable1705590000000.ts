import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class UpdateLineStationsTable1705590000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Remove the 'order' column
        await queryRunner.dropColumn("line_stations", "stop_order");

        // 2. Add the 'next_station_id' column
        // We make it nullable because the last station in a line won't have a next station
        await queryRunner.addColumn(
            "line_stations",
            new TableColumn({
                name: "next_station_id",
                type: "int", // Ensure this matches your 'stations.id' type
                isNullable: true,
            })
        );

        // 3. Add Foreign Key constraint for 'next_station_id'
        await queryRunner.createForeignKey(
            "line_stations",
            new TableForeignKey({
                name: "FK_line_stations_next_station",
                columnNames: ["next_station_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "stations",
                onDelete: "SET NULL",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert steps in exact reverse order
    }
}