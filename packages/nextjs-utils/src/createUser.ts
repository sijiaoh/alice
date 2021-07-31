import { BaseEntity } from 'typeorm';
import { createProfile } from './createProfile';
import { login, LoginOptions, User } from './login';
import { Request } from './server-types';

export const createUser = async <T extends User & BaseEntity>(
  loginOptions: LoginOptions
) => {
  return new Promise<T>((resolve) => {
    void login(
      {} as Request,
      createProfile(),
      (_, user) => {
        resolve(user as T);
      },
      loginOptions
    );
  });
};
