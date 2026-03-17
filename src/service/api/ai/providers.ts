import { request } from '@/service/request';

export function fetchGetLLMProviderList() {
  return request<Api.AI.LLMProvider[]>({ url: '/ai/providers' });
}

export function fetchGetLLMProviderOptions() {
  return request<CommonType.Option[]>({ url: '/ai/providers/options' });
}

export function fetchCreateLLMProvider(data: Api.AI.LLMProviderCreateParams) {
  return request<Api.AI.LLMProvider>({
    url: '/ai/providers',
    method: 'post',
    data
  });
}

export function fetchGetLLMProvider(providerId: number) {
  return request<Api.AI.LLMProvider>({
    url: `/ai/providers/${providerId}`
  });
}

export function fetchUpdateLLMProvider(providerId: number, data: Api.AI.LLMProviderUpdateParams) {
  return request<Api.AI.LLMProvider>({
    url: `/ai/providers/${providerId}`,
    method: 'put',
    data
  });
}

export function fetchDeleteLLMProvider(providerId: number) {
  return request<null>({
    url: `/ai/providers/${providerId}`,
    method: 'delete'
  });
}
