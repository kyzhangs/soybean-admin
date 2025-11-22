import { request } from '@/service/request';

/** get user list */
export function fetchGetUserList(data: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
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
export function fetchDeteleUser(data: Api.SystemManage.UserDeleteParams) {
  return request<Api.SystemManage.User>({
    url: '/system-manage/users/del',
    method: 'post',
    data
  });
}
