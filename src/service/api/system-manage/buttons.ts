import { request } from '@/service/request';

/** get button page list */
export function fetchGetButtonPageList(data: Api.SystemManage.ButtonSearchParams) {
  return request<Api.SystemManage.ButtonPageList>({
    url: '/system-manage/buttons/list',
    method: 'post',
    data
  });
}

/** create button */
export function fetchCreateButton(data: Api.SystemManage.ButtonCreateParams) {
  return request<Api.SystemManage.Button>({
    url: '/system-manage/buttons',
    method: 'post',
    data
  });
}

/** update button */
export function fetchUpdateButton(data: Api.SystemManage.ButtonUpdateParams) {
  return request<Api.SystemManage.Button>({
    url: '/system-manage/buttons/update',
    method: 'post',
    data
  });
}

/** delete button */
export function fetchDeleteButton(data: Api.Common.DeleteParams) {
  return request({
    url: '/system-manage/buttons/del',
    method: 'post',
    data
  });
}

/** batch operate buttons */
export function fetchBatchOperateButton(data: Api.Common.BatchOperateParams) {
  return request<Api.Common.BatchOperateOut>({
    url: '/system-manage/buttons/batch',
    method: 'post',
    data
  });
}
