import { request } from '@/service/request';

/** Get user profile */
export function fetchGetUserInfo() {
  return request<Api.UC.UserInfo>({ url: '/uc/profile' });
}
