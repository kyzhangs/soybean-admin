import { request } from '../request';

/**
 * Token
 *
 * @param username Username
 * @param password Password
 */
export function fetchLogin(username: string, password: string) {
  return request<Api.Auth.LoginResult>({
    url: '/auth/token',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: {
      username,
      password
    }
  });
}

/** Verify a two-factor login challenge */
export function fetchVerifyTwoFactor(data: Api.Auth.TwoFactorVerifyParams) {
  return request<Api.Auth.Token>({
    url: '/auth/2fa/verify',
    method: 'post',
    data
  });
}

/** Create a username-less Passkey authentication challenge */
export function fetchPasskeyLoginOptions() {
  return request<Api.Auth.PasskeyOptions>({
    url: '/auth/passkey/options',
    method: 'post'
  });
}

/** Verify a Passkey assertion and return project tokens */
export function fetchVerifyPasskey(data: Api.Auth.PasskeyVerifyParams) {
  return request<Api.Auth.Token>({
    url: '/auth/passkey/verify',
    method: 'post',
    data
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
