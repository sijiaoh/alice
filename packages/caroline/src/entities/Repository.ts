import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Repository {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  name!: string;

  @Column()
  readonly userId!: string;
  @ManyToOne(() => User, (user) => user.repositories, { onDelete: 'CASCADE' })
  readonly user!: User;
}
