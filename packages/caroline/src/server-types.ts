import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'src/entities/User';

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
