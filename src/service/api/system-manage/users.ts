import { request } from '@/service/request';

/** get user list */
export function fetchGetUserPageList(data: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserPageList>({
    url: '/system-manage/users/list',
    method: 'post',
    data
  });
}

/** fetch create user */
export function fetchCreateUser(data: Api.SystemManage.UserCreateParams) {
  return request<Api.SystemManage.User>({
    url: '/system-manage/users',
    method: 'post',
    data
  });
}

/** fetch update user */
export function fetchUpdateUser(data: Api.SystemManage.UserUpdateParams) {
  return request<Api.SystemManage.User>({
    url: '/system-manage/users/update',
    method: 'post',
    data
  });
}

/** fetch delete user */
export function fetchDeteleUser(data: Api.Common.DeleteParams) {
  return request({
    url: '/system-manage/users/del',
    method: 'post',
    data
  });
}
