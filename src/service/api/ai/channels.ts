import { request } from '@/service/request';

export function fetchModelChannelCatalog() {
  return request<Api.AI.ChannelCatalog>({ url: '/ai/channels' });
}

export function fetchModelChannelPage(params: {
  page: number;
  page_size: number;
  keyword?: string | null;
  code?: string | null;
  status?: Api.Common.Status | null;
}) {
  return request<Api.AI.ModelChannelPage>({ url: '/ai/channels/page', params });
}

export function fetchCreateModelChannel(data: Api.AI.ModelChannelCreateParams) {
  return request<Api.AI.ModelChannel>({ url: '/ai/channels', method: 'POST', data });
}

export function fetchGetModelChannel(id: string) {
  return request<Api.AI.ModelChannel>({ url: `/ai/channels/${id}` });
}

export function fetchUpdateModelChannel(id: string, data: Api.AI.ModelChannelUpdateParams) {
  return request<Api.AI.ModelChannel>({ url: `/ai/channels/${id}`, method: 'PUT', data });
}

export function fetchDeleteModelChannel(id: string) {
  return request<null>({ url: `/ai/channels/${id}`, method: 'DELETE' });
}

export function fetchUpdateModelChannelStatus(id: string, status: Api.Common.Status) {
  return request<Api.AI.ModelChannel>({
    url: `/ai/channels/${id}/status`,
    method: 'PATCH',
    data: { status }
  });
}

export function fetchDiscoverModels(channelId: string) {
  return request<Api.AI.ModelDiscovery[]>({
    url: `/ai/channels/${channelId}/discover`,
    method: 'POST'
  });
}
