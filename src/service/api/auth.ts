import { request } from '../request';

/**
 * Login
 *
 * @param username Username
 * @param password Password
 */
export function fetchLogin(username: string, password: string) {
  return request<Api.Auth.Token>({
    url: '/auth/token',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: {
      username,
      password
    }
  });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refresh_token: string) {
  return request<Api.Auth.Token>({
    url: '/auth/refresh-token',
    method: 'post',
    data: {
      refresh_token
    }
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
