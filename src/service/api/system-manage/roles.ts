import { request } from '@/service/request';

/** get role paginating data */
export function fetchGetRolePaginatingData(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RolePaginatingData>({
    url: '/system-manage/roles/list',
    params
  });
}

/** get create role  */
export function fetchAddRole(data: Api.SystemManage.RoleCreateParams) {
  return request<Api.SystemManage.Role>({
    url: '/system-manage/roles',
    method: 'post',
    data
  });
}

/** batch delete roles  */
export function fetchBatchOperateRoles(data: Api.Common.BatchOperateParams) {
  return request({
    url: '/system-manage/roles/batch',
    method: 'post',
    data
  });
}

/** update role */
export function fetchUpdateRole(data: Api.SystemManage.RoleUpdateParams) {
  return request<Api.SystemManage.Role>({
    url: `/system-manage/roles/update`,
    method: 'post',
    data
  });
}

/** delete role */
export function fetchDeleteRole(id: number) {
  return request<Api.SystemManage.Role>({
    url: `/system-manage/roles/del`,
    method: 'post',
    data: { id }
  });
}

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllEnabledRoles() {
  return request<Api.SystemManage.Role[]>({
    url: '/system-manage/roles/enabled'
  });
}

/** get role menu list */
export function fetchGetRoleMenuList(role_id: number) {
  return request<Api.SystemManage.MenuList>({
    url: `/system-manage/roles/${role_id}/menus`
  });
}
