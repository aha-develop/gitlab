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
  console.log('~~~~~~~~~~', authData.token);

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
export const withGitLubApi = async <T extends (api: any, ...rest) => any>(
  callback: T,
  cachedOnly = false,
  cachedRetry = true
): Promise<ReturnType<T>> => {
  const api = await gitlabApi(cachedOnly, cachedRetry);
  return await callback(api);
};
