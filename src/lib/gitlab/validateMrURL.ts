/**
 * Validate Pull Request URL
 *
 * @param urlString
 * @returns
 */
export const validateMrURL = (urlString: string) => {
  const url = new URL(urlString);
  return url.origin === 'https://gitlab.com' && url.pathname.match(/\/[^\/]+\/[^\/]+\/[^\/]+\/merge_requests\/\d+/);
};
