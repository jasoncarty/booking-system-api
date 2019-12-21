import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity({ name: 'events' })
export class Event extends BaseEntity {
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
    type: 'timestamptz',
    nullable: true
  })
  starts_at: Date;

  @Column({
    type: 'timestamptz',
    nullable: true
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
  })
  maximum_event_attendees: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
