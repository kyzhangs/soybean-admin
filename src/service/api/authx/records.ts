import { request } from '@/service/request';

export function fetchGetRecordsPage(params: Api.Authx.LoginRecordSearchParams) {
  return request<Api.Authx.LoginRecordPage>({
    url: '/authx/records/page',
    params
  });
}
