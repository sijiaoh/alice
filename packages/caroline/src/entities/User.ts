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
import { Repository } from './Repository';
import { SocialProfile } from './SocialProfile';

@Entity()
export class User extends BaseEntity {
  static async createWithSocialProfile(profile: Profile) {
    return getConnection().transaction(async (manager) => {
      const user = await manager.save(manager.create(User));
      await manager.save(
        manager.create(SocialProfile, {
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

  @OneToMany(() => SocialProfile, (socialProfile) => socialProfile.user)
  readonly socialProfiles!: SocialProfile[];
  @OneToMany(() => Repository, (repository) => repository.user)
  readonly repositories!: Repository[];
}
