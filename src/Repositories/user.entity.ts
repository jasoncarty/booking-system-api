/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  Index,
} from 'typeorm';
import { IsEmail } from 'class-validator';

import { UserRole } from '../dto';
import { EventAttendee } from './eventAttendee.entity';

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export const relationType = type => EventAttendee;
export const relation = eventAttendee => eventAttendee.user;

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Index(['email'])
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    unique: true,
    nullable: false,
  })
  @IsEmail(
    {},
    {
      message: 'Invalid email',
    },
  )
  email: string;

  @Column({
    nullable: true,
  })
  password: string;

  @Column({
    default: false,
    nullable: true,
  })
  confirmed: boolean;

  @Column({
    nullable: true,
  })
  confirmed_at: Date;

  @Column({
    unique: true,
    nullable: true,
  })
  verification_token: string;

  @Column({
    nullable: true,
  })
  verification_sent_at: Date;

  @Column({
    unique: true,
    nullable: true,
  })
  password_reset_token: string;

  @Column({
    nullable: true,
  })
  password_reset_token_sent_at: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(relationType, relation, {
    onDelete: 'CASCADE',
  })
  eventAttendees: EventAttendee[];
}
