import { request } from '@/service/request';

/** get api paginating data */
export function fetchGetApiPaginatingData(params?: Api.SystemManage.ApiSearchParams) {
  return request<Api.SystemManage.ApiPaginatingData>({
    url: '/system-manage/apis',
    params
  });
}

/** update api status */
export function fetchUpdateApiStatus(api_id: number, data: Api.SystemManage.ApiUpdateStatusParams) {
  return request<Api.SystemManage.Api>({
    url: `/system-manage/apis/${api_id}`,
    method: 'put',
    data
  });
}

/** refresh apis */
export function fetchRefreshApi() {
  return request({
    url: '/system-manage/apis/refresh-api',
    method: 'post'
  });
}

/** get api tags list */
export function fetchGetApiTagsList() {
  return request({
    url: '/system-manage/apis/tags'
  });
}
