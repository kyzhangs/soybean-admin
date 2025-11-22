import { request } from '@/service/request';

/** get role list */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/systemManage/getRoleList',
    method: 'get',
    params
  });
}

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllEnabledRoles() {
  return request<Api.SystemManage.AllRole[]>({
    url: '/system-manage/roles/enabled'
  });
}
