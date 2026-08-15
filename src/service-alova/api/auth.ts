import { alova } from '../request';

/**
 * Login
 *
 * @param username Username
 * @param password Password
 */
export function fetchLogin(username: string, password: string) {
  return alova.Post<Api.Authx.Token>('/authx/login', { username, password });
}

/** Get user info */
export function fetchGetUserInfo() {
  return alova.Get<Api.UserCenter.UserInfo>('/authx/getUserInfo');
}

/** Send captcha to target phone */
export function sendCaptcha(phone: string) {
  return alova.Post<null>('/authx/sendCaptcha', { phone });
}

/** Verify captcha */
export function verifyCaptcha(phone: string, code: string) {
  return alova.Post<null>('/authx/verifyCaptcha', { phone, code });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return alova.Post<Api.Authx.Token>(
    '/authx/refreshToken',
    { refreshToken },
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
  return alova.Get('/authx/error', {
    params: { code, msg },
    shareRequest: false
  });
}
