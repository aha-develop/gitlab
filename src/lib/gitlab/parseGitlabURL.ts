/**
 * Get repo url and pr id
 *
 * @param url
 * @returns
 */
export const parseGitlabURL = (url: string): ParsedMR => {
  const parsedURL = new URL(url).pathname.split('/');
  return {
    repo: parsedURL.slice(1, 3).join('/'),
    mrId: parsedURL[5]
  };
};
