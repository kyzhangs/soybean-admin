import { request } from '../request';

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.UserCenter.UserInfo>({ url: '/uc/profile' });
}

export function fetchUpdateTimezone(data: Api.UserCenter.TimezoneUpdateParams) {
  return request<Api.UserCenter.UserInfo>({ url: '/uc/profile/timezone', method: 'PUT', data });
}

export function fetchGetAuthSessions() {
  return request<Api.UserCenter.AuthSession[]>({ url: '/uc/sessions' });
}

export function fetchRevokeAuthSession(sessionId: string) {
  return request<null>({ url: `/uc/sessions/${sessionId}`, method: 'delete' });
}

export function fetchGetOwnLoginLogPage(params: Api.UserCenter.LoginLogSearchParams) {
  return request<Api.UserCenter.LoginLogPage>({ url: '/uc/login-logs/page', params });
}

export function fetchGetAuthIdentities() {
  return request<Api.UserCenter.AuthIdentity[]>({ url: '/uc/identities' });
}

export function fetchDeleteAuthIdentity(identityId: string) {
  return request<null>({ url: `/uc/identities/${identityId}`, method: 'delete' });
}

export function fetchSyncAuthIdentity(identityId: string) {
  return request<null>({
    url: `/uc/identities/${identityId}/sync`,
    method: 'post'
  });
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

/** Get Passkeys bound to the current account */
export function fetchGetPasskeys() {
  return request<Api.UserCenter.Passkey[]>({ url: '/uc/passkeys' });
}

/** Create a Passkey registration challenge after password reauthentication */
export function fetchPasskeyRegistrationOptions(password: string) {
  return request<Api.UserCenter.PasskeyRegistrationOptions>({
    url: '/uc/passkeys/register/options',
    method: 'post',
    data: { password }
  });
}

/** Verify and bind a Passkey */
export function fetchVerifyPasskeyRegistration(data: Api.UserCenter.PasskeyRegistrationVerifyParams) {
  return request<Api.UserCenter.Passkey>({
    url: '/uc/passkeys/register/verify',
    method: 'post',
    data
  });
}

/** Delete a biometric credential after password reauthentication */
export function fetchDeletePasskey(passkeyId: string, password: string) {
  return request<null>({
    url: `/uc/passkeys/${passkeyId}`,
    method: 'delete',
    data: { password }
  });
}
