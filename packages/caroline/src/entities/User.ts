import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { Repository } from './Repository';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  penName!: string;

  @OneToMany(() => Repository, (repository) => repository.user)
  repositories!: Repository[];
}
