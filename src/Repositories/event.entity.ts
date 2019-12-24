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

import { EventAttendee } from './eventAttendee.entity';

@Entity({ name: 'events' })
export class Event extends BaseEntity {
  @Index(['starts_at'])
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  starts_at: Date;

  @Column({
    nullable: true,
  })
  ends_at: Date;

  @Column({
    nullable: true,
  })
  title: string;

  @Column({
    nullable: true,
  })
  preview: string;

  @Column({
    nullable: true,
    default: 0,
  })
  maximum_event_attendees: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  @OneToMany(type => EventAttendee, eventAttendee => eventAttendee.event, {
    onDelete: 'CASCADE',
  })
  eventAttendees: EventAttendee[];
}
