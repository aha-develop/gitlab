import { IDENTIFIER } from 'extension.js';
import { linkBranch, linkMergeRequest, referenceToRecordFromTitle } from '@lib/fields.js';

const EMPTY_SHA = '0000000000000000000000000000000000000000';

aha.on('webhook', async ({ headers, payload }) => {
  const event = headers.HTTP_X_GITLAB_EVENT;

  console.log(`Received webhook '${event}' ${payload.event_type || ''}`);

  // Flag the account as having successfully set up the webhook
  aha.account.setExtensionField(IDENTIFIER, 'webhookConfigured', true);

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

  if (!record) {
    return null;
  }

  // Link MR to record
  await triggerEvent('mr.update', payload, record);
  await triggerAutomation(payload, record)
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
 * Trigger an automation
 *
 * @param payload
 * @param record
 */
async function triggerAutomation(payload: Webhook.Payload, record) {
  if (payload?.event_type !== "merge_request") return;

  const { object_attributes } = payload
  if (!object_attributes) return;

  // Check the record is a supported type
  if (!["Epic", "Feature", "Requirement"].includes(record.typename)) {
    return;
  }

  const triggers: Record<string, (pr: any) => string> = {
    open: (pr) => pr.work_in_progress ? "draftPrOpened" : "prOpened",
    close: () => "prClosed",
    reopen: () => "prReopened",
    merge: () => "prMerged",
    approved: () => "prApproved",
    unapproval: () => "prChangesRequested"
  };

  const { action } = object_attributes
  if (!action) return

  const trigger = (triggers[action] || (() => null))(
    payload.object_attributes
  );

  console.log(`Triggering ${trigger} automation on ${record.referenceNumber}`)

  if (trigger) {
    await aha.triggerAutomationOn(
      record,
      [IDENTIFIER, trigger].join("."),
      true
    );
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
