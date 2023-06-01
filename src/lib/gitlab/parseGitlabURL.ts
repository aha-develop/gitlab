const MR_REGEX = /https:\/\/.*?\/(.*?)\/-\/merge_requests\/(\d+)/;

/**
 * Get repo path and pr id from the full url
 */
export const parseGitlabURL = (url: string): ParsedMR | undefined => {
  const match = url.match(MR_REGEX);
  if (match) {
    return {
      repo: match[1],
      mrId: match[2]
    };
  }
};
