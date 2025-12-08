import { request } from '@/service/request';

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.Menu[]>({
    url: '/system-manage/menus/list'
  });
}

/** batch operate menus */
export function fetchBatchOperateMenu(data: Api.Common.BatchOperateParams) {
  return request<Api.Common.BatchOperateOut>({
    url: '/system-manage/menus/batch',
    method: 'post',
    data
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/system-manage/menus/tree'
  });
}

/** get role home options */
export function fetchGetRoleHomeOptions() {
  return request<CommonType.Option<string, string>[]>({
    url: '/system-manage/menus/role-home-options'
  });
}

/** get first level menu options */
export function fetchGetFirstLevelMenuOptions() {
  return request<CommonType.Option<string, string>[]>({
    url: '/system-manage/menus/first-level-menu-options'
  });
}
