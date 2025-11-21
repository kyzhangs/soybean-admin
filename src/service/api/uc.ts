import { request } from '../request';

/** Fetch user profile */
export function fetchGetUserProfile() {
  return request<Api.Auth.Profile>({ url: '/uc/profile' });
}
