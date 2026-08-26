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

export const authExceptionMessageRecord: Record<string, App.I18n.I18nKey> = {
  '100121': 'page.login.callback.error.accountInactive',
  '100122': 'page.login.callback.error.accountDeleted',
  '100123': 'page.login.callback.error.accountDisabled',
  '100160': 'page.login.callback.error.casDisabled',
  '100161': 'page.login.callback.error.casFlowInvalid',
  '100162': 'page.login.callback.error.casTicketMissing',
  '100163': 'page.login.callback.error.casUnavailable',
  '100164': 'page.login.callback.error.casTicketValidationFailed',
  '100165': 'page.login.callback.error.casResponseInvalid',
  '100166': 'page.login.callback.error.casSubjectMissing',
  '100167': 'page.login.callback.error.casIdentityNotBound',
  '100168': 'page.login.callback.error.casTicketInvalid',
  '100169': 'page.login.callback.error.casLogoutInvalid',
  '100170': 'page.login.callback.error.casRateLimited',
  '100180': 'page.login.callback.error.providerNotFound',
  '100181': 'page.login.callback.error.providerDisabled',
  '100182': 'page.login.callback.error.providerConfigInvalid',
  '100183': 'page.login.callback.error.authFlowInvalid',
  '100184': 'page.login.callback.error.authRateLimited',
  '100185': 'page.login.callback.error.authTicketInvalid',
  '100186': 'page.login.callback.error.externalIdentityNotBound',
  '100187': 'page.login.callback.error.providerCallbackInvalid',
  '100188': 'page.login.callback.error.providerUnavailable',
  '100189': 'page.login.callback.error.externalAccountBoundElsewhere',
  '100190': 'page.login.callback.error.providerAlreadyBound'
};
