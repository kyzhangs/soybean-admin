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
