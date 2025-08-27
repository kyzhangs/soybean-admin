import { transformRecordToOption } from '@/utils/common';

export const enableStatusRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  '1': 'page.manage.common.status.enable',
  '2': 'page.manage.common.status.disable'
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

export const userGenderRecord: Record<Api.SystemManage.UserGender, App.I18n.I18nKey> = {
  '1': 'page.manage.user.userGender.male',
  '2': 'page.manage.user.userGender.female',
  '3': 'page.manage.user.userGender.unknown'
};

export const userGenderOptions = transformRecordToOption(userGenderRecord);

export const menuTypeRecord: Record<Api.SystemManage.MenuType, App.I18n.I18nKey> = {
  '1': 'page.manage.menu.type.directory',
  '2': 'page.manage.menu.type.menu'
};

export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

export const menuIconTypeRecord: Record<Api.SystemManage.IconType, App.I18n.I18nKey> = {
  '1': 'page.manage.menu.iconType.iconify',
  '2': 'page.manage.menu.iconType.local'
};

export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord);

export const apiMethodRecord: Record<Api.SystemManage.ApiMethod, App.I18n.I18nKey> = {
  GET: 'page.manage.api.apiMethod.get',
  POST: 'page.manage.api.apiMethod.post',
  PATCH: 'page.manage.api.apiMethod.patch',
  PUT: 'page.manage.api.apiMethod.put',
  DELETE: 'page.manage.api.apiMethod.delete'
};

export const apiMethodOptions = transformRecordToOption(apiMethodRecord);
