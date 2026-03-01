import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { City } from './city.entity';
import { LineStation } from './line-station.entity';
import { Ticket } from './ticket.entity';

@Entity('stations')
export class Station {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'city_id', nullable: true })
    cityId: number;

    @ManyToOne(() => City, city => city.stations)
    @JoinColumn({ name: 'city_id' })
    city: City;

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
    latitude: number;

    @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
    longitude: number;

    @Column({ name: 'zone_id', nullable: true })
    zoneId: number;

    @OneToMany(() => LineStation, lineStation => lineStation.station)
    lineStations: LineStation[];

    @OneToMany(() => Ticket, ticket => ticket.sourceStation)
    sourceTickets: Ticket[];

    @OneToMany(() => Ticket, ticket => ticket.destinationStation)
    destinationTickets: Ticket[];
}
