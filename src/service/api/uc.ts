import { request } from '../request';

/** Fetch user info */
export function fetchGetUserInfo() {
  return request<Api.UC.UserInfo>({ url: '/uc/profile' });
}
