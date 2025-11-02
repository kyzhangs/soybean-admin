import { request } from '@/service/request';

/** get api paginating data */
export function fetchGetApiPaginatingData(params?: Api.SystemManage.ApiSearchParams) {
  return request<Api.SystemManage.ApiPaginatingData>({
    url: '/system-manage/apis/list',
    params
  });
}

/** update api status */
export function fetchUpdateApi(data: Api.SystemManage.ApiUpdateStatusParams) {
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

/** get api tags list */
export function fetchGetApiTagsList() {
  return request({
    url: '/system-manage/apis/tags'
  });
}
