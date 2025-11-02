import { request } from '@/service/request';

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.User.UserInfo>({ url: '/uc/profile' });
}
