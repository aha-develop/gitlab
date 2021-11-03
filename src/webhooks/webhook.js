import {
  linkMergeRequest,
  linkBranch,
  referenceToRecord,
} from "../lib/fields.js";

const EMPTY_SHA = '0000000000000000000000000000000000000000';

aha.on("webhook", async ({ headers, payload }) => {
  const event = headers.HTTP_X_GITLAB_EVENT;

  console.log(`Received webhook '${event}' ${payload.event_type || ""}`);

  switch (event) {
    case "Push Hook":
      await handleCreateBranch(payload);
      break;
    case "Merge Request Hook":
      await handleMergeRequest(payload);
      break;
    default:
      console.log(`No action registered for ${event}`)
      break;
  }
});

async function handleMergeRequest(payload) {
  const mr = payload.object_attributes;

  // Make sure the PR is linked to its record.
  const record = await linkMergeRequest(mr);

  // Generate events.
  if (record) {
    if (mr.source_branch) {
      await linkBranch(mr.source_branch, mr.source.web_url);
    }
  }

  await triggerEvent(`merge_request.${mr.action}`, payload, record);
}

async function handleCreateBranch(payload) {
  // GitLab doesn't have a dedicated event for new branches
  // Detect via the method recommended in the feature request:
  //   https://gitlab.com/gitlab-org/gitlab/-/issues/17962#note_214985234
  if (payload.before === EMPTY_SHA) {
    const branchName = payload.ref.replace('refs/heads/', '')
    const record = await linkBranch(branchName, payload.repository.homepage);
    await triggerEvent("branch.create", payload, record);
  }
}

/**
 * @param {string} event
 * @param {*} payload
 * @param {*} referenceText
 */
async function triggerEvent(event, payload, referenceText) {
  let record = referenceText;

  if (typeof referenceText === "string") {
    record = await referenceToRecord(referenceText);
  }

  aha.triggerServer(`aha-develop.gitlab.${event}`, {
    record,
    payload,
  });
}
