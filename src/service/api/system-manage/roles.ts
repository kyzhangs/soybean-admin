import { request } from '@/service/request';

/** get role list */
export function fetchGetEnabledRoles() {
  return request<CommonType.Option<string, string>[]>({
    url: '/system-manage/roles/enabled'
  });
}

export function fetchBatchOperateRole(data: Api.Common.BatchOperateParams) {
  return request<Api.Common.BatchOperateOut>({
    url: '/system-manage/roles/batch',
    method: 'post',
    data
  });
}

/** get role page list */
export function fetchGetRolePageList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RolePageList>({
    url: '/system-manage/roles',
    params
  });
}

export function fetchCreateRole(data: Api.SystemManage.RoleCreateParams) {
  return request<Api.SystemManage.Role>({
    url: '/system-manage/roles',
    method: 'post',
    data
  });
}

export function fetchGetRole(role_id: number) {
  return request<Api.SystemManage.Role>({
    url: `/system-manage/roles/${role_id}`
  });
}

export function fetchUpdateRole(role_id: number, data: Api.SystemManage.RoleCreateParams) {
  return request<Api.SystemManage.Role>({
    url: `/system-manage/roles/${role_id}`,
    method: 'put',
    data
  });
}

export function fetchDeleteRole(role_id: number) {
  return request<Api.SystemManage.Role>({
    url: `/system-manage/roles/${role_id}`,
    method: 'delete'
  });
}
