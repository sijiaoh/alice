import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { User } from './User';

@Entity()
export class Repository {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  name!: string;

  @ManyToOne(() => User, (user) => user.repositories)
  user!: User;
}
