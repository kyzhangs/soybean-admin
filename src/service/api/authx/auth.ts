import { request } from '@/service/request';
import { getServiceBaseURL } from '@/utils/service';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

export function fetchLogin(username: string, password: string) {
  return request<Api.Authx.LoginResult>({
    url: '/authx/token',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: { username, password }
  });
}

export function fetchVerifyTwoFactor(data: Api.Authx.TwoFactorVerifyParams) {
  return request<Api.Authx.TwoFactorVerifyResult>({
    url: '/authx/2fa/verify',
    method: 'post',
    withCredentials: true,
    data
  });
}

export function fetchPasskeyLoginOptions() {
  return request<Api.Authx.PasskeyOptions>({
    url: '/authx/passkey/options',
    method: 'post'
  });
}

export function fetchVerifyPasskey(data: Api.Authx.PasskeyVerifyParams) {
  return request<Api.Authx.Token>({
    url: '/authx/passkey/verify',
    method: 'post',
    data
  });
}

export function fetchRefreshToken(refresh_token: string) {
  return request<Api.Authx.Token>({
    url: '/authx/refresh-token',
    method: 'post',
    data: { refresh_token }
  });
}

export function fetchPublicAuthProviders() {
  return request<Api.Authx.PublicAuthProvider[]>({ url: '/authx/providers' });
}

export function fetchAuthProviderExchange(login_ticket: string) {
  return request<Api.Authx.AuthProviderExchangeResult>({
    url: '/authx/exchange',
    method: 'post',
    withCredentials: true,
    data: { login_ticket }
  });
}

export function getAuthProviderLoginUrl(providerCode: string, redirect: string, callbackUrl: string) {
  const params = new URLSearchParams({ redirect, callback_url: callbackUrl });
  return `${baseURL}/authx/${encodeURIComponent(providerCode)}/login?${params.toString()}`;
}

export function fetchAuthBindingFlow(providerCode: string, callbackUrl: string) {
  return request<Api.Authx.BindingFlow>({
    url: '/uc/identities/binding',
    method: 'post',
    withCredentials: true,
    data: { provider_code: providerCode, callback_url: callbackUrl }
  });
}

export function fetchPendingAuthBinding() {
  return request<Api.UserCenter.PendingAuthBinding>({
    url: '/uc/identities/binding/pending',
    withCredentials: true
  });
}

export function fetchConfirmAuthBinding(flowId: string) {
  return request<null>({
    url: '/uc/identities/binding/confirm',
    method: 'post',
    data: { flow_id: flowId },
    withCredentials: true
  });
}

export function fetchCancelAuthBinding(flowId: string) {
  return request<null>({
    url: '/uc/identities/binding/pending',
    method: 'delete',
    data: { flow_id: flowId },
    withCredentials: true
  });
}

export function fetchLogout() {
  return request<void>({ url: '/authx/logout', method: 'post' });
}

export function getAuthProviderLogoutUrl(providerCode: string, service: string) {
  const params = new URLSearchParams({ service });
  return `${baseURL}/authx/${encodeURIComponent(providerCode)}/logout?${params.toString()}`;
}

export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/authx/error', params: { code, msg } });
}
