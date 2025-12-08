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

/** get role options */
export function fetchGetRoleOptions() {
  return request<CommonType.Option<string, string>>({
    url: '/system-manage/roles/role-options'
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

export function fetchGetRoleAuthSettings() {
  return request({
    url: '/system-manage/roles/R_SUPER/auth-settings'
  });
}
