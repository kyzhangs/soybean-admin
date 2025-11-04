import { request } from '../request';

/** get constant routes */
export function fetchGetConstantRoutes() {
  return request<Api.Route.MenuRoute[]>({ url: '/route/constant-routes' });
}

/** get user routes */
export function fetchGetUserRoutes() {
  return request<Api.Route.UserRoute>({ url: '/route/user-routes' });
}

/**
 * whether the route is exist
 *
 * @param route_name route name
 */
export function fetchIsRouteExist(params: Api.Route.RouteExistParams) {
  return request<boolean>({ url: '/route/exists', params });
}
