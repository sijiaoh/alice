import type { NextApiRequest, NextApiResponse } from 'next';

export interface DefaultUser {
  id: string;
  accessToken: string;
}

export interface Request<User extends DefaultUser = DefaultUser>
  extends NextApiRequest {
  session: {
    accessToken: string;
  } | null;
  user?: User;
}

export type Response = NextApiResponse;

export interface Context<User extends DefaultUser = DefaultUser> {
  req: Request<User>;
  res: Response;
}
