export type RouteParams = Record<string, string | number>;
export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue | QueryValue[]>;

const paramRegex = /:([A-Za-z0-9_]+)/g;

/**
 * Build a route path with named params: `/users/:id` + `{ id: \"123\" }`.
 */
export function buildPath(template: string, params?: RouteParams) {
  if (!params) return template;

  return template.replace(paramRegex, (_, key: string) => {
    const value = params[key];
    if (value === undefined || value === null) {
      throw new Error(`Missing route param "${key}" for "${template}".`);
    }
    return encodeURIComponent(String(value));
  });
}

/**
 * Attach query parameters to a path. Filters out undefined/null values.
 */
export function withQuery(path: string, query?: QueryParams) {
  if (!query) return path;

  const search = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null) return;
        search.append(key, String(item));
      });
      return;
    }

    search.append(key, String(value));
  });

  const queryString = search.toString();
  return queryString ? `${path}?${queryString}` : path;
}
