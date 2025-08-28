import { alova } from '../request';

/** get role paginating data */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return alova.Get<Api.SystemManage.RolePaginatingData>('/system-manage/roles', { params });
}

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllRoles() {
  return alova.Get<Api.SystemManage.Role[]>('/system-manage/roles/all');
}

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return alova.Get<Api.SystemManage.UserPaginatingData>('/system-manage/users', { params });
}

/** add user */
export function addUser(data: Api.SystemManage.UserCreateParams) {
  return alova.Post<null>('/system-manage/users', data);
}

/** update user */
export function updateUser(data: Api.SystemManage.UserUpdateParams) {
  return alova.Put<null>('/system-manage/users', data);
}

/** delete user */
export function deleteUser(id: number) {
  return alova.Delete<null>(`/system-manage/users/${id}`);
}

/** batch delete user */
export function batchDeleteUser(ids: number[]) {
  return alova.Delete<null>(`/system-manage/users/batch`, { ids });
}

/** get menu list */
export function fetchGetMenuList() {
  return alova.Get<Api.SystemManage.MenuList>('/system-manage/menus');
}

/** get all pages */
export function fetchGetAllPages() {
  return alova.Get<string[]>('/system-manage/pages/all');
}

/** get menu tree */
export function fetchGetMenuTree() {
  return alova.Get<Api.SystemManage.MenuTree[]>('/system-manage/menus/tree');
}
