import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { User } from './User';

@Entity()
export class Repository {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  name!: string;

  @Column()
  readonly userId!: string;
  @ManyToOne(() => User, async (user) => user.repositories)
  readonly user!: Promise<User>;
}
