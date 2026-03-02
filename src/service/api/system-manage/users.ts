import { request } from '@/service/request';

export function fetchBatchOperateUser(data: Api.Common.BatchOperateParams) {
  return request<Api.Common.BatchOperateOut>({
    url: '/system-manage/users/batch',
    method: 'post',
    data
  });
}

/** get user page list */
export function fetchGetUserPageList(params: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserPageList>({
    url: '/system-manage/users',
    params
  });
}

export function fetchCreateUser(data: Api.SystemManage.UserCreateParams) {
  return request<Api.SystemManage.User>({
    url: '/system-manage/users',
    method: 'post',
    data
  });
}

export function fetchGetUser(user_id: number) {
  return request<Api.SystemManage.User>({
    url: `/system-manage/users/${user_id}`
  });
}

export function fetchUpdateUser(user_id: number, data: Api.SystemManage.UserUpdateParams) {
  return request<Api.SystemManage.User>({
    url: `/system-manage/users/${user_id}`,
    method: 'put',
    data
  });
}

export function fetchDeleteUser(user_id: number) {
  return request({
    url: `/system-manage/users/${user_id}`,
    method: 'delete'
  });
}
