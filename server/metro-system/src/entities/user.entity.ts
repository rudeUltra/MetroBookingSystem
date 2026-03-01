import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { UserProfile } from './user-profile.entity';
import { UserMfa } from './user-mfa.entity';
import { Payment } from './payment.entity';
import { Ticket } from './ticket.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  @OneToMany(() => UserMfa, (mfa) => mfa.user)
  mfaRecords: UserMfa[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];
}