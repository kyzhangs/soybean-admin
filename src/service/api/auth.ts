import { request } from '../request';

/** Get token */
export function fetchLogin(data: Api.Auth.LoginForm) {
  return request<Api.Auth.Token>({
    url: '/auth/token',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  });
}

/** Refresh token */
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
