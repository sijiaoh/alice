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
import { User } from './User';

@Entity()
@Index(['userId', 'provider'], { unique: true })
@Index(['provider', 'token'], { unique: true })
export class SocialProfile extends BaseEntity {
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
  @ManyToOne(() => User, async (user) => user.socialProfiles, {
    nullable: false,
  })
  readonly user!: Promise<User>;
}
