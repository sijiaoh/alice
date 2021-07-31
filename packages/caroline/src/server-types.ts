import {
  Request as BaseRequest,
  Response as BaseResponse,
  Context as BaseContext,
} from 'nextjs-utils';
import { UserEntity } from './entities';

export type Request = BaseRequest<UserEntity>;
export type Response = BaseResponse;
export type Context = BaseContext<UserEntity>;
