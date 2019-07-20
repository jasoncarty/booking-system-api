import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { IsEmail } from 'class-validator';

import { UserRole } from '../proto';

@Entity({ name: 'users' })
export class User extends BaseEntity {
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
}
