import { request } from '@/service/request';

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.MenuList>({
    url: '/system-manage/menus/list'
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/system-manage/menus/tree'
  });
}

/** get firstLevelMenus */
export function fetchGetFirstLevelMenus() {
  return request({
    url: '/system-manage/menus/first-level-menus'
  });
}

/** batch operate menu */
export function fetchBatchOperateMenu(data: Api.Common.BatchOperateParams) {
  return request<Api.Common.BatchOperateResult>({
    url: '/system-manage/menus/batch',
    method: 'post',
    data
  });
}
