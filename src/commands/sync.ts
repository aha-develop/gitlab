import { linkMergeRequestToRecord } from '@lib/fields';
import { withGitLubApi } from '@lib/gitlab/api';
import { getMRFromURL } from '@lib/gitlab/getMRFromURL';

import { getExtensionFields } from '@lib/fields';

aha.on('sync', async ({ record }, { settings }) => {
  if (!record) {
    // @ts-ignore
    aha.commandOutput('Open a record first to sync MRs for that record');
    return;
  }

  console.log(`Syncing MRs for ${record.referenceNum}`);

  const mergeRequests = (await getExtensionFields('mergeRequests', record)) as IExtensionFieldMergeRequest[];
  for await (const mr of mergeRequests ?? []) {
    if (mr?.webUrl) {
      const mrResult = await withGitLubApi(getMRFromURL(mr?.webUrl));
      if (mrResult) {
        linkMergeRequestToRecord(mrResult, record);
      }
    }
  }
});
