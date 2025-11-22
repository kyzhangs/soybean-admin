import { transformRecordToOption } from '@/utils/common';

export const enableStatusRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  '1': 'page.system-manage.common.status.enable',
  '2': 'page.system-manage.common.status.disable'
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

export const userGenderRecord: Record<Api.SystemManage.UserGender, App.I18n.I18nKey> = {
  '1': 'page.system-manage.users.gender.male',
  '2': 'page.system-manage.users.gender.female',
  '3': 'page.system-manage.users.gender.unknown'
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
