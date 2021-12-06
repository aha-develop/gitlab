import { unlinkBranches, unlinkMergeRequests } from '@lib/fields';

aha.on('removeLinks', async ({ record }) => {
  await unlinkMergeRequests(record);
  await unlinkBranches(record);
});
