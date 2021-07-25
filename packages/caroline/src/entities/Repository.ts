import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import type { User } from './User';

@Entity()
export class Repository extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  name!: string;

  @Column()
  readonly userId!: string;
  @ManyToOne('User', (user: User) => user.repositories, { onDelete: 'CASCADE' })
  readonly user!: User;
}
