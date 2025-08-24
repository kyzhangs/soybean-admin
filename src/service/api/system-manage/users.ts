import { request } from '@/service/request';

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/system-manage/users',
    params
  });
}

/** create user */
export function fetchCreateUser(data: Api.SystemManage.UserCreateParams) {
  return request<Api.SystemManage.User>({
    url: '/system-manage/users',
    method: 'post',
    data
  });
}

/** batch delete user */
export function fetchBatchDeleteUser(ids: string[]) {
  return request<Api.SystemManage.User>({
    url: '/system-manage/users',
    method: 'delete',
    data: { ids }
  });
}

/** update user */
export function fetchUpdateUser(user_id: number, data: Api.SystemManage.UserUpdateParams) {
  return request<Api.SystemManage.User>({
    url: `/system-manage/users/${user_id}`,
    method: 'put',
    data
  });
}

/** delete user */
export function fetchDeleteUser(user_id: number) {
  return request<Api.SystemManage.User>({
    url: `/system-manage/users/${user_id}`,
    method: 'delete'
  });
}

/** reset user password */
export function fetchResetUserPassword(user_id: number, data: Api.SystemManage.ResetUserPassword) {
  return request<Api.SystemManage.User>({
    url: `/system-manage/users/${user_id}/reset-password`,
    method: 'post',
    data
  });
}
