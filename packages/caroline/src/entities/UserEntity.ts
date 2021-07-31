import { Profile } from 'passport';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  Generated,
  getConnection,
} from 'typeorm';
import type { RepositoryEntity } from './RepositoryEntity';
import { SocialProfileEntity } from './SocialProfileEntity';

@Entity('users')
export class UserEntity extends BaseEntity {
  static async createWithSocialProfile(profile: Profile) {
    return getConnection().transaction(async (manager) => {
      const user = await manager.save(manager.create(UserEntity));
      await manager.save(
        manager.create(SocialProfileEntity, {
          userId: user.id,
          provider: profile.provider,
          token: profile.id,
          email: profile.emails![0].value,
        })
      );
      return user;
    });
  }

  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  @Generated('uuid')
  @Index({ unique: true })
  readonly accessToken!: string;
  @Column({ default: 'defaultPenName' })
  penName!: string;

  @CreateDateColumn()
  readonly createdAt!: Date;
  @UpdateDateColumn()
  readonly updatedAt!: Date;

  @OneToMany(() => SocialProfileEntity, (socialProfile) => socialProfile.user)
  readonly socialProfiles!: SocialProfileEntity[];
  @OneToMany(
    'RepositoryEntity',
    (repository: RepositoryEntity) => repository.user
  )
  readonly repositories!: RepositoryEntity[];
}
