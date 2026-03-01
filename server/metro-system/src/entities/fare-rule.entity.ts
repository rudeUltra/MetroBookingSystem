import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('fare_rules')
export class FareRule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'base_fare', type: 'decimal', precision: 10, scale: 2 })
    baseFare: number;

    @Column({ name: 'price_per_km', type: 'decimal', precision: 10, scale: 2 })
    pricePerKm: number;

    @Column({ name: 'peak_multiplier', type: 'decimal', precision: 3, scale: 2, default: 1.0 })
    peakMultiplier: number;

    @CreateDateColumn({ name: 'effective_from' })
    effectiveFrom: Date;
}
