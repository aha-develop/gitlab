const regex = /\/[^\/]+\/[^\/]+\/[^\/]+\/merge_requests\/\d+/;

/**
 * Validate Merge Request URL
 */
export const validateMrURL = (urlString: string) => {
  try {
    const url = new URL(urlString);
    return url.origin === 'https://gitlab.com' && regex.test(url.pathname);
  } catch (err) {
    return false;
  }
};
