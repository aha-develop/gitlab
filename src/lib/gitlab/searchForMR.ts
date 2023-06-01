import { IDENTIFIER } from 'extension';
import { gitlabFetchApi } from './api';

interface ApiMergeRequest {
  id: number;
  project_id: number;
  title: string;
  web_url: string;
}

export async function searchForMR(query: string) {
  // @ts-ignore
  const repos = aha.settings.get(IDENTIFIER).repos as string[];
  if (!repos) return [];

  const api = gitlabFetchApi();
  const escapedQuery = encodeURIComponent(query);
  const response = await api(`merge_requests?search=${escapedQuery}&in=title`);
  const data = (await response.json()) as ApiMergeRequest[];

  if (!data || !data.length) return [];

  return data.filter((mr) => {
    return repos.some((r) => mr.web_url.includes(r));
  });
}
