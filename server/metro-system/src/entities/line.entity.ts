import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { LineStation } from './line-station.entity';
@Entity('lines')
export class Line {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'line_name', length: 50 })
    lineName: string;

    @Column({ name: 'color_code', length: 7, nullable: true })
    colorCode: string;

    @OneToMany(() => LineStation, lineStation => lineStation.line)
    lineStations: LineStation[];
}
