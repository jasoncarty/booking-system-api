/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  Index,
} from 'typeorm';

import { User } from './user.entity';
import { Event } from './event.entity';

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export const userRelationType = type => User;
export const userRelation = user => user.eventAttendees;

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
export const eventRelationType = type => Event;
export const eventRelation = event => event.eventAttendees;

@Entity({ name: 'eventAttendees' })
export class EventAttendee extends BaseEntity {
  @Index(['event', 'user'], { unique: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  userId: number;

  @Column({
    nullable: true,
  })
  eventId: number;

  @Column({
    nullable: false,
    default: false,
  })
  reserve: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(userRelationType, userRelation, {
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;

  @ManyToOne(eventRelationType, eventRelation, {
    onDelete: 'CASCADE',
  })
  event: Event;
}
