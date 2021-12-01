import { linkMergeRequestToRecord } from '@lib/fields';
import { withGitLubApi } from '@lib/gitlab/api';
import { getMRFromURL } from '@lib/gitlab/getMRFromURL';
import { validateMrURL } from '@lib/gitlab/validateMrURL';

aha.on('addLink', async ({ record, context }) => {
  if (!record) {
    // @ts-ignore
    aha.commandOutput('Open a record first to sync MRs for that record');
    return;
  }

  const mrUrl = await aha.commandPrompt('Link URL', {
    placeholder: 'Enter the URL to a merge request'
  });

  if (!validateMrURL(mrUrl)) {
    throw new Error('Please enter a valid merge request URL');
  }

  const res = await withGitLubApi(getMRFromURL(mrUrl));
  if (res) {
    await linkMergeRequestToRecord(res, record);
  } else {
    throw new Error('Could not link this merge request! Please enter a valid merge request URL!');
  }
});
