import { GraphQLClient } from 'graphql-request';

/**
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
