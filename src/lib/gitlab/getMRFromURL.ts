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
  async (api): Promise<Gitlab.MR | undefined> => {
    const mergeRequestInfo = parseGitlabURL(url);
    if (!mergeRequestInfo) {
      return undefined;
    }

    const { repo, mrId } = mergeRequestInfo;
    const { project = undefined } = await api.request(GetMRByIid, { fullPath: repo, iids: [mrId] });
    return project?.mergeRequests?.nodes?.[0] ?? undefined;
  };
