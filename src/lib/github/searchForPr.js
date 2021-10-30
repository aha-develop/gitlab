import { SearchForPr } from "../gitlab/queries";

/**
 * @typedef SearchForPrOptions
 * @prop {string} query
 * @prop {number=} count
 * @prop {boolean=} includeStatus
 * @prop {boolean=} includeReviews
 * @prop {boolean=} includeLabels
 */

/**
 * @param {import('./api').GithubApi} api
 * @param {SearchForPrOptions} options
 * @returns {Promise<{edges: {node: Github.Pr}[]}>}
 */
export async function searchForPr(api, options) {
  const variables = { count: 20, searchQuery: options.query, ...options };
  // @ts-ignore
  delete variables["query"];
  const { search } = await api(SearchForPr, variables);
  return search;
}
