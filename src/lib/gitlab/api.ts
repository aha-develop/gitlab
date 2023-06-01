import { GraphQLClient } from 'graphql-request';

/**
 * Get a graphql client for the gitlab API:
 *
 * ```ts
 * const api = await gitlabApi();
 * const response = await api.request(`
 *  query {
 *    project(fullPath: "aha-develop/aha-develop.gitlab") {
 *      mergeRequests {
 *        nodes {
 *          id
 *          title
 *        }
 *      }
 *    }
 * }
 * `);
 * ```
 *
 * @param cachedOnly
 * @returns
 */
export const gitlabApi = async (cachedOnly = false, cachedRetry = true) => {
  const options = { useCachedRetry: cachedRetry };
  if (cachedOnly) {
    options['reAuth'] = false;
  }

  const authData = await aha.auth('gitlab', options);

  return new GraphQLClient('https://gitlab.com/api/graphql', {
    headers: {
      Authorization: `Bearer ${authData.token}`
    }
  });
};

/**
 *
 * @param callback
 * @returns
 */
export const withGitLabApi = async <T extends (api: any, ...rest) => any>(
  callback: T,
  cachedOnly = false,
  cachedRetry = true
): Promise<ReturnType<T>> => {
  const api = await gitlabApi(cachedOnly, cachedRetry);
  return await callback(api);
};

/**
 * Get a custom fetch function that works with the gitlab REST API:
 *
 * ```ts
 * const api = gitlabFetchApi();
 * const response = await api(`merge_requests?search=${escapedQuery}&in=title`);
 * const data = await response.json();
 * ```
 */
export const gitlabFetchApi = (cachedOnly = false, cachedRetry = true) => {
  const authOptions = { useCachedRetry: cachedRetry };
  if (cachedOnly) {
    authOptions['reAuth'] = false;
  }

  return async (path: string, options: RequestInit = {}) => {
    const authData = await aha.auth('gitlab', authOptions);
    const url = `https://gitlab.com/api/v4/${path}`;

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${authData.token}`
      }
    });
  };
};
