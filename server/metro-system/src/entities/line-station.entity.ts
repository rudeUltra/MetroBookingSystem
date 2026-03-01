import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Line } from './line.entity';
import { Station } from './station.entity';

@Entity('line_stations')
export class LineStation {
    @PrimaryColumn({ name: 'line_id' })
    lineId: number;

    @PrimaryColumn({ name: 'station_id' })
    stationId: number;

    @ManyToOne(() => Line, line => line.lineStations)
    @JoinColumn({ name: 'line_id' })
    line: Line;

    @ManyToOne(() => Station, station => station.lineStations)
    @JoinColumn({ name: 'station_id' })
    station: Station;

    @Column({ name: 'next_station_id' })
    nextStationId: number;

    @Column({ name: 'distance_to_next_stop', type: 'decimal', precision: 10, scale: 2, default: 0.00 })
    distanceToNextStop: number;
}
