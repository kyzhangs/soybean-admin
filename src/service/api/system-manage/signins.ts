import { request } from '@/service/request';

export function fetchGetLoginLogPage(params: Api.SystemManage.LoginLogSearchParams) {
  return request<Api.SystemManage.LoginLogPage>({
    url: '/system-manage/signins/page',
    params
  });
}
