import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Ticket } from './ticket.entity';
@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', nullable: true })
    userId: number;

    @ManyToOne(() => User, user => user.payments)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ length: 20, nullable: true })
    status: string;

    @Column({ name: 'transaction_ref', length: 100, unique: true, nullable: true })
    transactionRef: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => Ticket, ticket => ticket.payment)
    tickets: Ticket[];
}
