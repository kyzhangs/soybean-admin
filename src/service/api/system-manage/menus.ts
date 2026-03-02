import { request } from '@/service/request';

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.Menu[]>({
    url: '/system-manage/menus'
  });
}

/** get enabled menus */
export function fetchGetEnabledMenus() {
  return request<CommonType.Option<string, string>[]>({
    url: '/system-manage/menus/enabled'
  });
}

/** batch menus */
export function fetchBatchOperateMenu(data: Api.Common.BatchOperateParams) {
  return request<Api.Common.BatchOperateOut>({
    url: '/system-manage/menus/batch',
    method: 'post',
    data
  });
}

export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/system-manage/menus/tree'
  });
}
