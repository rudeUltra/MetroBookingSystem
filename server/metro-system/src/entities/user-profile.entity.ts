import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
    @PrimaryColumn({ name: 'user_id' })
    userId: number;

    @OneToOne(() => User, user => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'first_name', length: 50, nullable: true })
    firstName: string;

    @Column({ name: 'last_name', length: 50, nullable: true })
    lastName: string;

    @Column({ name: 'phone_number', length: 20, nullable: true })
    phoneNumber: string;
}
