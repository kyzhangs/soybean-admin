import { request } from '@/service/request';

/** get role paginating data */
export function fetchGetRolePaginatingData(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RolePaginatingData>({
    url: '/system-manage/roles',
    method: 'get',
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
export function fetchBatchDeleteRoles(ids: string[]) {
  return request({
    url: '/system-manage/roles',
    method: 'delete',
    data: { ids }
  });
}

/** update role */
export function fetchUpdateRole(role_id: number, data: Api.SystemManage.RoleUpdateParams) {
  return request<Api.SystemManage.Role>({
    url: `/system-manage/roles/${role_id}`,
    method: 'put',
    data
  });
}

/** delete role */
export function fetchDeleteRole(role_id: number) {
  return request<Api.SystemManage.Role>({
    url: `/system-manage/roles/${role_id}`,
    method: 'delete'
  });
}

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllEnabledRoles() {
  return request<Api.SystemManage.Role[]>({
    url: '/system-manage/roles/enabled-roles'
  });
}

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.MenuList>({
    url: '/system-manage/menus',
    method: 'get'
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request({
    url: '/system-manage/pages',
    method: 'get'
  });
}
