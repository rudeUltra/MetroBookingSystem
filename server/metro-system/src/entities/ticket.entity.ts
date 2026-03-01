import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Payment } from './payment.entity';
import { Station } from './station.entity';

@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', nullable: true })
    userId: number;

    @ManyToOne(() => User, user => user.tickets)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'payment_id', nullable: true })
    paymentId: number;

    @ManyToOne(() => Payment, payment => payment.tickets)
    @JoinColumn({ name: 'payment_id' })
    payment: Payment;

    @Column({ name: 'source_station_id', nullable: true })
    sourceStationId: number;

    @ManyToOne(() => Station, station => station.sourceTickets)
    @JoinColumn({ name: 'source_station_id' })
    sourceStation: Station;

    @Column({ name: 'destination_station_id', nullable: true })
    destinationStationId: number;

    @ManyToOne(() => Station, station => station.destinationTickets)
    @JoinColumn({ name: 'destination_station_id' })
    destinationStation: Station;

    @Column({ name: 'fare_paid', type: 'decimal', precision: 10, scale: 2, nullable: true })
    farePaid: number;

    @Column({ name: 'qr_code_token', nullable: true, unique: true, type: 'text' })
    qrCodeToken: string;

    @Column({ length: 20, default: 'active' })
    status: string;

    @Column({ name: 'expires_at', nullable: true })
    expiresAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
