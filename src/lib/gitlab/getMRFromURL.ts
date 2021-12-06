import { GetMRByIid } from './queries';
import { parseGitlabURL } from './parseGitlabURL';

/**
 * Get Project info and MergeRequest Detail from URL
 *
 * @param url
 * @returns
 */
export const getMRFromURL =
  (url: string) =>
  async (api): Promise<Gitlab.MR> => {
    const { repo, mrId } = parseGitlabURL(url);
    const { project = undefined } = await api.request(GetMRByIid, { fullPath: repo, iids: [mrId] });
    return project?.mergeRequests?.nodes?.[0] ?? undefined;
  };
