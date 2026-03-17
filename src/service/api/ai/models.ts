import { request } from '@/service/request';

export function fetchGetLLMModelPageList(params: Api.AI.LLMModelSearchParams) {
  return request<Api.AI.LLMModelPageList>({
    url: '/ai/models',
    params
  });
}

export function fetchCreateLLMModel(data: Api.AI.LLMModelCreateParams) {
  return request<Api.AI.LLMModel>({
    url: '/ai/models',
    method: 'post',
    data
  });
}

export function fetchBatchOperateLLMModel(data: Api.Common.BatchOperateParams) {
  return request<Api.Common.BatchOperateOut>({
    url: '/ai/models/batch',
    method: 'post',
    data
  });
}

export function fetchGetLLMModel(modelId: number) {
  return request<Api.AI.LLMModel>({
    url: `/ai/models/${modelId}`
  });
}

export function fetchUpdateLLMModel(modelId: number, data: Api.AI.LLMModelUpdateParams) {
  return request<Api.AI.LLMModel>({
    url: `/ai/models/${modelId}`,
    method: 'put',
    data
  });
}

export function fetchDeleteLLMModel(modelId: number) {
  return request<null>({
    url: `/ai/models/${modelId}`,
    method: 'delete'
  });
}
