import { request } from '@/service/request';

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.Menu[]>({
    url: '/system-manage/menus'
  });
}

/** get enabled menus */
export function fetchGetMenuOptions() {
  return request<CommonType.Option[]>({
    url: '/system-manage/menus/options'
  });
}

/** batch menus */
export function fetchBatchOperateMenu(data: { operate: string; ids: string[] }) {
  return request<any>({
    url: '/system-manage/menus/batch',
    method: 'POST',
    data
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/system-manage/menus/tree'
  });
}

/** get menu bound buttons */
export function fetchGetMenuButtons(menuId: string) {
  return request<Api.SystemManage.MenuButtonBinding>({
    url: `/system-manage/menus/${menuId}/buttons`
  });
}

/** update menu bound buttons */
export function fetchUpdateMenuButtons(menuId: string, data: Api.SystemManage.MenuButtonBinding) {
  return request<Api.SystemManage.MenuButtonBinding>({
    url: `/system-manage/menus/${menuId}/buttons`,
    method: 'PUT',
    data
  });
}

/** update menu */
export function fetchUpdateMenu(menuId: string, data: any) {
  return request<Api.SystemManage.Menu>({
    url: `/system-manage/users/${menuId}`,
    method: 'PUT',
    data
  });
}

/** delete menu */
export function fetchDeleteMenu(menuId: string) {
  return request<null>({
    url: `/system-manage/menus/${menuId}`,
    method: 'DELETE'
  });
}
