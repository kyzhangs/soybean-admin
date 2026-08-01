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

/** Get current user's two-factor authentication status */
export function fetchGetTwoFactorStatus() {
  return request<Api.UserCenter.TwoFactorStatus>({ url: '/uc/2fa/status' });
}

/** Create a pending TOTP configuration */
export function fetchSetupTwoFactor(data: Api.UserCenter.TwoFactorSetupParams) {
  return request<Api.UserCenter.TwoFactorSetup>({
    url: '/uc/2fa/setup',
    method: 'POST',
    data
  });
}

/** Confirm and enable TOTP */
export function fetchEnableTwoFactor(data: Api.UserCenter.TwoFactorEnableParams) {
  return request<Api.UserCenter.TwoFactorEnableResult>({
    url: '/uc/2fa/enable',
    method: 'POST',
    data
  });
}

/** Disable TOTP for the current user */
export function fetchDisableTwoFactor(data: Api.UserCenter.TwoFactorDisableParams) {
  return request<null>({
    url: '/uc/2fa/disable',
    method: 'POST',
    data
  });
}

/** Regenerate recovery codes for the current user */
export function fetchRegenerateTwoFactorRecoveryCodes(data: Api.UserCenter.TwoFactorRecoveryCodesRegenerateParams) {
  return request<Api.UserCenter.TwoFactorEnableResult>({
    url: '/uc/2fa/recovery-codes/regenerate',
    method: 'POST',
    data
  });
}
