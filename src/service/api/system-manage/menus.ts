import { request } from '@/service/request';

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.MenuList>({
    url: '/system-manage/menus/list',
    method: 'get'
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/systemManage/getMenuTree',
    method: 'get'
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request<string[]>({
    url: '/systemManage/getAllPages',
    method: 'get'
  });
}

/** get menu options */
export function fetchGetMenuOptions() {
  return request<CommonType.Option<string, string>>({
    url: '/system-manage/menus/menu-options'
  });
}
