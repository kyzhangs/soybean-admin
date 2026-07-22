import { request } from '@/service/request';

export function fetchGetButtonTree() {
  return request<Api.SystemManage.ButtonTree[]>({
    url: '/system-manage/buttons/tree'
  });
}

export function fetchCreateButton(data: Api.SystemManage.ButtonCreateParams) {
  return request<Api.SystemManage.Button>({
    url: '/system-manage/buttons',
    method: 'POST',
    data
  });
}

/** get button page list */
export function fetchGetButtonPageList(params: Api.SystemManage.ButtonSearchParams) {
  return request<Api.SystemManage.ButtonPageList>({
    url: '/system-manage/buttons/page',
    params
  });
}

/** batch operate buttons */
export function fetchBatchButton(data: Api.Common.BatchOperateParams) {
  return request<null>({
    url: '/system-manage/buttons/batch',
    method: 'POST',
    data
  });
}

export function fetchGetButton(buttonId: string) {
  return request<Api.SystemManage.Button>({
    url: `/system-manage/buttons/${buttonId}`
  });
}

export function fetchUpdateButton(buttonId: string, data: Api.SystemManage.ButtonUpdateParams) {
  return request<Api.SystemManage.Button>({
    url: `/system-manage/buttons/${buttonId}`,
    method: 'PUT',
    data
  });
}

export function fetchDeleteButton(buttonId: string) {
  return request({
    url: `/system-manage/buttons/${buttonId}`,
    method: 'DELETE'
  });
}
