import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import type { UserEntity } from './UserEntity';

@Entity('social_profiles')
@Index(['userId', 'provider'], { unique: true })
@Index(['provider', 'token'], { unique: true })
export class SocialProfileEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: number;

  @Column()
  readonly provider!: string;
  @Column()
  readonly token!: string;
  @Column()
  readonly email!: string;

  @CreateDateColumn()
  readonly createdAt!: Date;
  @UpdateDateColumn()
  readonly updatedAt!: Date;

  @Column()
  readonly userId!: string;
  @ManyToOne('UserEntity', (user: UserEntity) => user.socialProfiles, {
    onDelete: 'CASCADE',
  })
  readonly user!: UserEntity;
}
