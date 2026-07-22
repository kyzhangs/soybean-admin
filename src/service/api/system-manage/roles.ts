import { request } from '@/service/request';

/** get role list */
export function fetchGetRoleList() {
  return request<Api.SystemManage.Role[]>({
    url: '/system-manage/roles'
  });
}

/** create role */
export function fetchCreateRole(data: Api.SystemManage.RoleCreateParams) {
  return request<Api.SystemManage.Role>({
    url: '/system-manage/roles',
    method: 'POST',
    data
  });
}

/** get role page list */
export function fetchGetRolePageList(params: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RolePageList>({
    url: '/system-manage/roles/page',
    params
  });
}

/** batch operate roles */
export function fetchBatchRole(data: Api.Common.BatchOperateParams) {
  return request<null>({
    url: '/system-manage/roles/batch',
    method: 'POST',
    data
  });
}

/** update role */
export function fetchGetRoleDetail(roleId: string) {
  return request<Api.SystemManage.Role>({
    url: `/system-manage/roles/${roleId}`,
    method: 'GET'
  });
}

/** get role permissions */
export function fetchGetRolePermissions(roleId: string) {
  return request<Api.SystemManage.RolePermissions>({
    url: `/system-manage/roles/${roleId}/permissions`
  });
}

/** update role permissions */
export function fetchUpdateRolePermissions(roleId: string, data: Api.SystemManage.RolePermissions) {
  return request<Api.SystemManage.RolePermissions>({
    url: `/system-manage/roles/${roleId}/permissions`,
    method: 'PUT',
    data
  });
}

/** update role */
export function fetchUpdateRole(roleId: string, data: Api.SystemManage.RoleUpdateParams) {
  return request<Api.SystemManage.Role>({
    url: `/system-manage/roles/${roleId}`,
    method: 'PUT',
    data
  });
}

/** delete role */
export function fetchDeleteRole(roleId: string) {
  return request<Api.SystemManage.Role>({
    url: `/system-manage/roles/${roleId}`,
    method: 'DELETE'
  });
}
