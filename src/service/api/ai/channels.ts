import { request } from '@/service/request';

export function fetchModelChannelCatalog() {
  return request<Api.AI.ChannelCatalog>({ url: '/ai/models/channels' });
}

export function fetchModelChannelPage(params: {
  page: number;
  page_size: number;
  keyword?: string | null;
  status?: Api.Common.Status | null;
}) {
  return request<Api.AI.ModelChannelPage>({ url: '/ai/models/channels/page', params });
}

export function fetchCreateModelChannel(data: Api.AI.ModelChannelCreateParams) {
  return request<Api.AI.ModelChannel>({ url: '/ai/models/channels', method: 'POST', data });
}

export function fetchGetModelChannel(id: string) {
  return request<Api.AI.ModelChannel>({ url: `/ai/models/channels/${id}` });
}

export function fetchUpdateModelChannel(id: string, data: Api.AI.ModelChannelUpdateParams) {
  return request<Api.AI.ModelChannel>({ url: `/ai/models/channels/${id}`, method: 'PUT', data });
}

export function fetchDeleteModelChannel(id: string) {
  return request<null>({ url: `/ai/models/channels/${id}`, method: 'DELETE' });
}

export function fetchUpdateModelChannelStatus(id: string, status: Api.Common.Status) {
  return request<Api.AI.ModelChannel>({
    url: `/ai/models/channels/${id}/status`,
    method: 'PATCH',
    data: { status }
  });
}

export function fetchDiscoverModels(channelId: string) {
  return request<Api.AI.ModelDiscovery[]>({
    url: `/ai/models/channels/${channelId}/discover`,
    method: 'POST'
  });
}
