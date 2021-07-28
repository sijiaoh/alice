import {
  Request as BaseRequest,
  Response as BaseResponse,
  Context as BaseContext,
} from 'nextjs-utils';
import { User } from './entities';

export type Request = BaseRequest<User>;
export type Response = BaseResponse;
export type Context = BaseContext<User>;
