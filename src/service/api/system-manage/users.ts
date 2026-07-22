import { request } from '@/service/request';

/** create user */
export function fetchCreateUser(data: Api.SystemManage.UserCreateParams) {
  return request<Api.SystemManage.User>({
    url: '/system-manage/users',
    method: 'POST',
    data
  });
}

/** get user page list */
export function fetchGetUserPageList(params: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserPageList>({
    url: '/system-manage/users/page',
    params
  });
}

/** batch operate users */
export function fetchBatchUser(data: Api.SystemManage.UserBatchOperateParams) {
  return request<null>({
    url: '/system-manage/users/batch',
    method: 'POST',
    data
  });
}

/** update user */
export function fetchUpdateUser(userId: string, data: Api.SystemManage.UserUpdateParams) {
  return request<Api.SystemManage.User>({
    url: `/system-manage/users/${userId}`,
    method: 'PUT',
    data
  });
}

/** reset user password */
export function fetchResetUserPassword(userId: string, data: Api.SystemManage.UserPasswordResetParams) {
  return request<null>({
    url: `/system-manage/users/${userId}/reset-password`,
    method: 'PUT',
    data
  });
}

/** delete user */
export function fetchDeleteUser(userId: string) {
  return request<Api.SystemManage.User>({
    url: `/system-manage/users/${userId}`,
    method: 'DELETE'
  });
}
