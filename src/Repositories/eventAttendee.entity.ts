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

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @ManyToOne(type => User, user => user.eventAttendees, {
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @ManyToOne(type => Event, event => event.eventAttendees, {
    onDelete: 'CASCADE',
  })
  event: Event;
}
