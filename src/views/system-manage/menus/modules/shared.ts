const LAYOUT_PREFIX = 'layout.';
const VIEW_PREFIX = 'view.';
const FIRST_LEVEL_ROUTE_COMPONENT_SPLIT = '$';

export function getLayoutAndPage(component?: string | null) {
  let layout = '';
  let page = '';

  const [layoutOrPage = '', pageItem = ''] = component?.split(FIRST_LEVEL_ROUTE_COMPONENT_SPLIT) || [];

  layout = getLayout(layoutOrPage);
  page = getPage(pageItem || layoutOrPage);

  return { layout, page };
}

function getLayout(layout: string) {
  return layout.startsWith(LAYOUT_PREFIX) ? layout.replace(LAYOUT_PREFIX, '') : '';
}

function getPage(page: string) {
  return page.startsWith(VIEW_PREFIX) ? page.replace(VIEW_PREFIX, '') : '';
}

export function transformLayoutAndPageToComponent(layout: string, page: string) {
  const hasLayout = Boolean(layout);
  const hasPage = Boolean(page);

  if (hasLayout && hasPage) {
    return `${LAYOUT_PREFIX}${layout}${FIRST_LEVEL_ROUTE_COMPONENT_SPLIT}${VIEW_PREFIX}${page}`;
  }

  if (hasLayout) {
    return `${LAYOUT_PREFIX}${layout}`;
  }

  if (hasPage) {
    return `${VIEW_PREFIX}${page}`;
  }

  return '';
}

/**
 * Get route name by route path
 *
 * @param routeName
 */
export function getRoutePathByRouteName(routeName: string) {
  return `/${routeName.replace(/_/g, '/')}`;
}

/**
 * Get path param from route path
 *
 * @param routePath route path
 */
export function getPathParamFromRoutePath(routePath: string) {
  const [path, param = ''] = routePath.split('/:');

  return {
    path,
    param
  };
}

/**
 * Get route path with param
 *
 * @param routePath route path
 * @param param path param
 */
export function getRoutePathWithParam(routePath: string, param: string) {
  if (param.trim()) {
    return `${routePath}/:${param}`;
  }

  return routePath;
}

/** the key-value pair of the menu route query, used by the form component */
export interface QueryPair {
  key: string;
  value: string;
}

/**
 * Transform the route query of the menu to key-value pairs
 *
 * The backend stores the route query as an object, but the form component(NDynamicInput) requires key-value pairs.
 *
 * @param query route query of the menu
 */
export function transformQueryToPairs(query: Api.SystemManage.Menu['query'] | Record<string, unknown> | null) {
  if (!query) {
    return [] as QueryPair[];
  }

  if (Array.isArray(query)) {
    return query as QueryPair[];
  }

  return Object.entries(query).map<QueryPair>(([key, value]) => ({ key, value: String(value) }));
}

/**
 * Transform key-value pairs to the route query of the menu
 *
 * @param pairs key-value pairs of the form
 */
export function transformPairsToQuery(pairs: QueryPair[] | null) {
  const query: Record<string, string> = {};

  (pairs || []).forEach(({ key, value }) => {
    if (key) {
      query[key] = value;
    }
  });

  return Object.keys(query).length ? query : null;
}
