import { login, createProfile } from 'nextjs-utils';
import { User } from 'src/entities/User';
import { loginOptions } from 'src/loginOptions';
import { Request } from 'src/server-types';

export const createUser = async () => {
  return new Promise<User>((resolve) => {
    void login(
      {} as Request,
      createProfile(),
      (_, user) => {
        resolve(user as User);
      },
      loginOptions
    );
  });
};
