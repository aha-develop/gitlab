import { runCommand } from '@lib/runCommand.js';
import { linkMergeRequest, linkBranch, referenceToRecordFromTitle, linkMergeRequestToRecord } from '../lib/fields.js';

const EMPTY_SHA = '0000000000000000000000000000000000000000';

aha.on('webhook', async ({ headers, payload }) => {
  const event = headers.HTTP_X_GITLAB_EVENT;

  console.log(`Received webhook '${event}' ${payload.event_type || ''}`);

  switch (event) {
    case 'Push Hook':
      await handleCreateBranch(payload);
      break;
    case 'Merge Request Hook':
      await handleMergeRequest(payload);
      break;
    default:
      console.log(`No action registered for ${event}`);
      break;
  }
});

const handleMergeRequest = async (payload: Webhook.Payload) => {
  const mr: Gitlab.MR = {
    id: `gid://gitlab/MergeRequest/${payload?.object_attributes?.id}`,
    iid: (payload?.object_attributes?.iid ?? '') as string,
    title: payload?.object_attributes?.title,
    webUrl: payload?.object_attributes?.url,
    state: payload?.object_attributes?.state,
    sourceBranch: payload?.object_attributes?.source_branch,
    targetBranch: payload?.object_attributes?.target_branch,
    projectId: (payload?.project?.id ?? '') as string,
    project: {
      webUrl: payload?.project?.web_url
    }
  };

  // Make sure the MR is linked to its record.
  const record = await linkMergeRequest(mr);

  // Link MR to record
  await linkMergeRequestToRecord(mr, record);
};

async function handleCreateBranch(payload: Webhook.Payload) {
  // GitLab doesn't have a dedicated event for new branches
  // Detect via the method recommended in the feature request:
  //   https://gitlab.com/gitlab-org/gitlab/-/issues/17962#note_214985234
  // if before commit non exist, new branch
  if (payload.before === EMPTY_SHA) {
    const branchName = payload?.ref?.replace('refs/heads/', '') ?? '';
    if (!branchName) {
      return;
    }

    const record = await linkBranch(branchName, payload?.repository?.homepage ?? '');
    await triggerEvent('branch.create', payload, record);
  }
}

/**
 * Trigger an Event
 *
 * @param event
 * @param payload
 * @param referenceText
 */
const triggerEvent = async (event: string, payload: any, referenceText) => {
  let record = referenceText;

  if (typeof referenceText === 'string') {
    record = await referenceToRecordFromTitle(referenceText);
  }

  aha.triggerServer(`aha-develop.gitlab.${event}`, {
    record,
    payload
  });
};
