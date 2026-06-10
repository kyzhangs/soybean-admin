import { request } from '../request';

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.UserCenter.UserInfo>({ url: '/uc/profile' });
}
