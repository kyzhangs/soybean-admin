import { request } from '@/service/request';

export function fetchGetAuthProviderPage(params: Api.Authx.AuthProviderSearchParams) {
  return request<Api.Authx.AuthProviderPageList>({ url: '/authx/providers/page', params });
}

export function fetchCreateAuthProvider(data: Api.Authx.AuthProviderCreateParams) {
  return request<Api.Authx.AuthProvider>({ url: '/authx/providers', method: 'POST', data });
}

export function fetchUpdateAuthProvider(id: string, data: Api.Authx.AuthProviderUpdateParams) {
  return request<Api.Authx.AuthProvider>({
    url: `/authx/providers/${id}`,
    method: 'PUT',
    data
  });
}

export function fetchDeleteAuthProvider(id: string) {
  return request<null>({ url: `/authx/providers/${id}`, method: 'DELETE' });
}

export function fetchUpdateAuthProviderStatus(id: string, status: Api.Common.Status) {
  return request<Api.Authx.AuthProvider>({
    url: `/authx/providers/${id}/status`,
    method: 'PATCH',
    data: { status }
  });
}

export function fetchTestAuthProvider(id: string) {
  return request<null>({ url: `/authx/providers/${id}/test`, method: 'POST' });
}

export function fetchTestAuthProviderProfile(id: string, callbackUrl: string) {
  return request<Api.Authx.AuthProviderProfileTestFlow>({
    url: `/authx/providers/${id}/test-profile`,
    method: 'POST',
    withCredentials: true,
    data: { callback_url: callbackUrl }
  });
}
