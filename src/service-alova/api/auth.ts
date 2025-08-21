import { alova } from '../request';

/**
 * Login
 *
 * @param username Username
 * @param password Password
 */
export function fetchLogin(username: string, password: string) {
  return alova.Post<Api.Auth.Token>('/auth/token', { username, password });
}

/** Get user info */
export function fetchGetUserInfo() {
  return alova.Get<Api.User.UserInfo>('/user/profile');
}

/** Send captcha to target phone */
export function sendCaptcha(phone: string) {
  return alova.Post<null>('/auth/sendCaptcha', { phone });
}

/** Verify captcha */
export function verifyCaptcha(phone: string, code: string) {
  return alova.Post<null>('/auth/verifyCaptcha', { phone, code });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refresh_token: string) {
  return alova.Post<Api.Auth.Token>(
    '/auth/refresh-token',
    { refresh_token },
    {
      meta: {
        authRole: 'refreshToken'
      }
    }
  );
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return alova.Get('/auth/error', {
    params: { code, msg },
    shareRequest: false
  });
}
