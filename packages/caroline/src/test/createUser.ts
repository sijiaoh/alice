import { createProfile } from './createProfile';
import { User } from 'src/entities/User';
import { login } from 'src/login';
import { Request } from 'src/server-types';

export const createUser = async () => {
  return new Promise<User>((resolve) => {
    void login({} as Request, createProfile(), (_, user) => {
      resolve(user as User);
    });
  });
};
