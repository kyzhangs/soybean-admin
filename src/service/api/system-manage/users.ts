import { request } from '@/service/request';

/** get user list */
export function fetchGetUserList(data: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/system-manage/users/list',
    method: 'post',
    data
  });
}
