import { request } from '@/service/request';

export function fetchModelPage(params: {
  page: number;
  page_size: number;
  channel_id?: string | null;
  code?: string | null;
  type?: Api.AI.ProtocolType | null;
  keyword?: string | null;
}) {
  return request<Api.AI.ModelPage>({ url: '/ai/models/page', params });
}

export function fetchGetModel(id: string) {
  return request<Api.AI.Model>({ url: `/ai/models/${id}` });
}

export function fetchCreateModel(data: Api.AI.ModelCreateParams) {
  return request<Api.AI.Model>({ url: '/ai/models', method: 'POST', data });
}

export function fetchUpdateModel(id: string, data: Api.AI.ModelUpdateParams) {
  return request<Api.AI.Model>({ url: `/ai/models/${id}`, method: 'PUT', data });
}

export function fetchDeleteModel(id: string) {
  return request<null>({ url: `/ai/models/${id}`, method: 'DELETE' });
}

export function fetchUpdateModelStatus(id: string, status: Api.Common.Status) {
  return request<Api.AI.Model>({
    url: `/ai/models/${id}/status`,
    method: 'PATCH',
    data: { status }
  });
}

export function fetchTestModel(id: string) {
  return request<Api.AI.ModelTestResult>({
    url: `/ai/models/${id}/test`,
    method: 'POST'
  });
}
