import { transformRecordToOption } from '@/utils/common';

export const enableStatusRecord: Record<Api.Common.Status, App.I18n.I18nKey> = {
  '1': 'page.system-manage.common.status.enable',
  '2': 'page.system-manage.common.status.disable'
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

export const userGenderRecord: Record<Api.SystemManage.Gender, App.I18n.I18nKey> = {
  '1': 'page.system-manage.users.UserGender.male',
  '2': 'page.system-manage.users.UserGender.female',
  '3': 'page.system-manage.users.UserGender.unknown'
};

export const userGenderOptions = transformRecordToOption(userGenderRecord);

export const menuTypeRecord: Record<Api.SystemManage.MenuType, App.I18n.I18nKey> = {
  '1': 'page.system-manage.menus.type.directory',
  '2': 'page.system-manage.menus.type.menu'
};

export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

export const menuIconTypeRecord: Record<Api.SystemManage.IconType, App.I18n.I18nKey> = {
  '1': 'page.system-manage.menus.iconType.iconify',
  '2': 'page.system-manage.menus.iconType.local'
};

export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord);

export const apiMethodRecord: Record<Api.SystemManage.ApiMethod, App.I18n.I18nKey> = {
  GET: 'page.system-manage.apis.apiMethod.get',
  POST: 'page.system-manage.apis.apiMethod.post',
  PUT: 'page.system-manage.apis.apiMethod.put',
  PATCH: 'page.system-manage.apis.apiMethod.patch',
  DELETE: 'page.system-manage.apis.apiMethod.delete'
};

export const apiMethodOptions = transformRecordToOption(apiMethodRecord);
