import { request } from '@/service/request';

export function fetchApiSync() {
  return request({
    url: '/system-manage/apis/sync',
    method: 'POST'
  });
}

export function fetchGetApiTags() {
  return request<Api.SystemManage.ApiTagOption[]>({
    url: '/system-manage/apis/tags'
  });
}

export function fetchGetApiTree() {
  return request<Api.SystemManage.ApiTree[]>({
    url: '/system-manage/apis/tree'
  });
}

/** get api page list */
export function fetchGetApiPageList(params: Api.SystemManage.ApiSearchParams) {
  return request<Api.SystemManage.ApiPageList>({
    url: '/system-manage/apis/page',
    params
  });
}

export function fetchBatchApi(data: Api.Common.BatchOperateParams) {
  return request<null>({
    url: '/system-manage/apis/batch',
    method: 'POST',
    data
  });
}

export function fetchUpdateApi(apiId: string, data: Api.SystemManage.ApiUpdateParams) {
  return request<Api.SystemManage.Api>({
    url: `/system-manage/apis/${apiId}`,
    method: 'PUT',
    data
  });
}
