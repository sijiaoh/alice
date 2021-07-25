import cookieSession from 'cookie-session';
import nextConnect from 'next-connect';
import { User } from './entities';
import { Request } from './server-types';
import { prepareConnection } from 'src/prepareConnection';
import { serverConfig } from 'src/serverConfig';

export const apiConnect = () => {
  return (
    nextConnect()
      .use(async (_, __, next) => {
        await prepareConnection();
        next();
      })
      // Enable session.
      .use(
        cookieSession({
          path: '/',
          secret: serverConfig.data.SESSION_SECRET,
          // 180 days.
          maxAge: 180 * 24 * 60 * 60 * 1000,
        })
      )
      // Set req.user
      .use<Request>(async (req, _, next) => {
        const accessToken = req.session?.accessToken;
        if (!accessToken) {
          next();
          return;
        }

        const user = await User.findOne({ where: { accessToken } });
        if (!user) {
          req.session = null;
          next();
          return;
        }

        req.user = user;
        next();
      })
  );
};
