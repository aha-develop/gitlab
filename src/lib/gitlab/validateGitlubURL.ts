/**
 * Validate Gitlab URL
 *
 * @param url
 * @returns
 */
export const validateGitlabURL = (url) => {
  const urlObj = new URL(url);
  return urlObj.origin === 'https://gitlab.com';
};
