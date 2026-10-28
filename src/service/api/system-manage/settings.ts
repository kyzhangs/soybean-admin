import { request } from '@/service/request';

export function fetchSetting(data: Api.SystemManage.SettingQuery) {
  return request<Api.SystemManage.Setting>({ url: '/system-manage/settings/get', method: 'POST', data });
}

export function fetchSettingList() {
  return request<Api.SystemManage.Setting[]>({ url: '/system-manage/settings', method: 'GET' });
}

export function updateSetting(data: Api.SystemManage.SettingUpdate) {
  return request<Api.SystemManage.Setting>({ url: '/system-manage/settings/set', method: 'POST', data });
}
