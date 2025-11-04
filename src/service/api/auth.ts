import { request } from '../request';

/** Login */
export function fetchLogin(data: Api.Auth.LoginForm) {
  return request<Api.Auth.Token>({
    url: '/auth/token',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  });
}

/** Get user profile */
export function fetchGetUserInfo() {
  return request<Api.UC.UserInfo>({ url: '/uc/profile' });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(data: Api.Auth.RefreshTokenParams) {
  return request<Api.Auth.Token>({
    url: '/auth/refresh-token',
    method: 'post',
    data
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/auth/error', params: { code, msg } });
}
