import { request } from '@/service/request';

/** get role list */
export function fetchGetRolePageList(data: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RolePageList>({
    url: '/system-manage/roles/list',
    method: 'post',
    data
  });
}

/** create role */
export function fetchCreateRole(data: Api.SystemManage.RoleCreateParams) {
  return request<Api.SystemManage.Role>({
    url: '/system-manage/roles',
    method: 'post',
    data
  });
}

/** update role */
export function fetchUpdateRole(data: Api.SystemManage.RoleUpdateParams) {
  return request<Api.SystemManage.Role>({
    url: '/system-manage/roles/update',
    method: 'post',
    data
  });
}

/** delete role */
export function fetchDeleteRole(data: Api.Common.DeleteParams) {
  return request({
    url: '/system-manage/roles/del',
    method: 'post',
    data
  });
}

/** batch operate roles */
export function fetchBatchOperateRole(data: Api.Common.BatchOperateParams) {
  return request<Api.Common.BatchOperateOut>({
    url: '/system-manage/roles/batch',
    method: 'post',
    data
  });
}

/** get role options */
export function fetchGetRoleOptions() {
  return request<CommonType.Option<string, string>>({
    url: '/system-manage/roles/role-options'
  });
}

/** get role permissions */
export function fetchGetRolePermissions(data: Api.SystemManage.RolePermissionsSearchParams) {
  return request<Api.SystemManage.RolePermissions>({
    url: '/system-manage/roles/role-permissions',
    method: 'post',
    data
  });
}

/** update role permissions */
export function fetchUpdateRolePermissions(data: Api.SystemManage.RolePermissionsUpdateParams) {
  return request<Api.SystemManage.RolePermissions>({
    url: '/system-manage/roles/update-role-permissions',
    method: 'post',
    data
  });
}
