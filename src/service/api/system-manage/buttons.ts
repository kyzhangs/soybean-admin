import { request } from '@/service/request';

/** get button page list */
export function fetchGetButtonPageList(params: Api.SystemManage.ButtonSearchParams) {
  return request<Api.SystemManage.ButtonPageList>({
    url: '/system-manage/buttons',
    params
  });
}

export function fetchBatchOperateButton(data: Api.Common.BatchOperateParams) {
  return request<Api.Common.BatchOperateOut>({
    url: '/system-manage/buttons/batch',
    method: 'post',
    data
  });
}

export function fetchGetButtonTree() {
  return request<Api.SystemManage.ButtonTree[]>({
    url: '/system-manage/buttons/tree'
  });
}

export function fetchCreateButton(data: Api.SystemManage.ButtonCreateParams) {
  return request<Api.SystemManage.Button>({
    url: '/system-manage/buttons',
    method: 'post',
    data
  });
}

export function fetchGetButton(button_id: number) {
  return request<Api.SystemManage.Button>({
    url: `/system-manage/buttons/${button_id}`
  });
}

export function fetchUpdateButton(button_id: number, data: Api.SystemManage.ButtonUpdateParams) {
  return request<Api.SystemManage.Button>({
    url: `/system-manage/buttons/${button_id}`,
    method: 'put',
    data
  });
}

export function fetchDeleteButton(button_id: number) {
  return request({
    url: `/system-manage/buttons/${button_id}`,
    method: 'delete'
  });
}
