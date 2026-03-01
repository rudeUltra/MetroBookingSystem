import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Station } from './station.entity';
@Entity('cities')
export class City {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ name: 'country_code', length: 2, nullable: true })
    countryCode: string;

    @OneToMany(() => Station, station => station.city)
    stations: Station[];
}
