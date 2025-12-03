import { request } from '@/service/request';

export function fetchGetApiPageList(data: Api.SystemManage.ApiSearchParams) {
  return request<Api.SystemManage.ApiPageList>({
    url: '/system-manage/apis/list',
    method: 'post',
    data
  });
}

export function fetchUpdateApi(data: Api.SystemManage.ApiUpdateParams) {
  return request<Api.SystemManage.Api>({
    url: '/system-manage/apis/update',
    method: 'post',
    data
  });
}

/** sync apis */
export function fetchSyncApi() {
  return request({
    url: '/system-manage/apis/sync',
    method: 'post'
  });
}

/** batch operate apis */
export function fetchBatchOperateApi(data: Api.Common.BatchOperateParams) {
  return request<Api.Common.BatchOperateOut>({
    url: '/system-manage/apis/batch',
    method: 'post',
    data
  });
}
