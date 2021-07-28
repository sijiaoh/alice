import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from './entities/User';

export interface Request extends NextApiRequest {
  session: {
    accessToken: string;
  } | null;
  user?: User;
}

export type Response = NextApiResponse;

export interface Context {
  req: Request;
  res: Response;
}
