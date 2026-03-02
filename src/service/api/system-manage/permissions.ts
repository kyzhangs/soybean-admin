import { request } from '@/service/request';

export function fetchGetRolePermissions(params: { role_code: string }) {
  return request<Api.SystemManage.Permissions>({
    url: '/system-manage/permissions',
    params
  });
}

export function fetchUpdateRolePermissions(
  params: { role_code: string },
  data: Api.SystemManage.PermissionsUpdateParams
) {
  return request<Api.SystemManage.Permissions>({
    url: '/system-manage/permissions',
    method: 'post',
    params,
    data
  });
}
