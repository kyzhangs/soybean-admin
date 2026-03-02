import { request } from '@/service/request';

export function fetchSyncApi() {
  return request({
    url: '/system-manage/apis/sync',
    method: 'post'
  });
}

export function fetchBatchOperateApi(data: Api.Common.BatchOperateParams) {
  return request<Api.Common.BatchOperateOut>({
    url: '/system-manage/apis/batch',
    method: 'post',
    data
  });
}

/** get api page list */
export function fetchGetApiPageList(params: Api.SystemManage.ApiSearchParams) {
  return request<Api.SystemManage.ApiPageList>({
    url: '/system-manage/apis',
    params
  });
}

export function fetchUpdateApi(api_id: number, data: Api.SystemManage.ApiUpdateParams) {
  return request<Api.SystemManage.Api>({
    url: `/system-manage/apis/${api_id}`,
    method: 'put',
    data
  });
}

export function fetchGetApiTags() {
  return request<CommonType.Option<string, string>[]>({ url: '/system-manage/apis/tags' });
}

export function fetchGetApiTree() {
  return request<Api.SystemManage.ApiTree[]>({ url: '/system-manage/apis/tree' });
}
