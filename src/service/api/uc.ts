import { request } from '../request';

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.UserCenter.UserInfo>({ url: '/uc/profile' });
}

/** Change current user's password */
export function fetchChangePassword(data: Api.UserCenter.PasswordChangeParams) {
  return request<null>({
    url: '/uc/password',
    method: 'PUT',
    data
  });
}
