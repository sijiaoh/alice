import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import type { UserEntity } from './UserEntity';

@Entity('repositories')
export class RepositoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  name!: string;

  @Column()
  readonly userId!: string;
  @ManyToOne('UserEntity', (user: UserEntity) => user.repositories, {
    onDelete: 'CASCADE',
  })
  readonly user!: UserEntity;
}
