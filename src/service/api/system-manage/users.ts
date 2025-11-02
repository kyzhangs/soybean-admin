import { request } from '@/service/request';

/** get user paginating data */
export function fetchGetUserPaginatingData(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserPaginatingData>({
    url: '/system-manage/users/list',
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
export function fetchBatchOperateUser(data: Api.Common.BatchOperateParams) {
  return request<Api.Common.BatchOperateResult>({
    url: '/system-manage/users/batch',
    method: 'post',
    data
  });
}

/** update user */
export function fetchUpdateUser(data: Api.SystemManage.UserUpdateParams) {
  return request<Api.SystemManage.User>({
    url: `/system-manage/users/update`,
    method: 'post',
    data
  });
}

/** delete user */
export function fetchDeleteUser(id: number) {
  return request<Api.SystemManage.User>({
    url: `/system-manage/users/del`,
    method: 'post',
    data: { id }
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
