import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_mfa')
export class UserMfa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id', nullable: true })
    userId: number;

    @ManyToOne(() => User, user => user.mfaRecords)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'otp_code', length: 6, nullable: true })
    otpCode: string;

    @Column({ name: 'expires_at', nullable: true })
    expiresAt: Date;

    @Column({ name: 'retry_count', default: 0 })
    retryCount: number;

    @Column({ name: 'is_verified', default: false })
    isVerified: boolean;
}
