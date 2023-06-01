import { linkMergeRequestToRecord } from '@lib/fields';
import { withGitLabApi } from '@lib/gitlab/api';
import { getMRFromURL } from '@lib/gitlab/getMRFromURL';
import { searchForMR } from '@lib/gitlab/searchForMR';

aha.on('sync', async ({ record }, { settings }) => {
  if (!record) {
    // @ts-ignore
    aha.commandOutput('Open a record first to sync MRs for that record');
    return;
  }

  console.log(`Syncing MRs for ${record.referenceNum}`);

  const mergeRequests = (await searchForMR(record.referenceNum)) || [];

  if (mergeRequests.length === 0) {
    aha.commandOutput('No MRs found for this record');
    return;
  }

  for (const mr of mergeRequests) {
    if (mr.web_url) {
      const mrResult = await withGitLabApi(getMRFromURL(mr.web_url));
      if (mrResult) {
        await linkMergeRequestToRecord(mrResult, record);
        aha.commandOutput(`Linked MR ${mrResult.webUrl}`);
      }
    }
  }
});
