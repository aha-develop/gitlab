import {
  linkMergeRequest,
  linkBranch,
  referenceToRecord,
} from "../lib/fields.js";

aha.on("webhook", async ({ headers, payload }) => {
  const event = headers.HTTP_X_GITLAB_EVENT;

  console.log(`Received webhook '${event}' ${payload.event_type || ""}`);

  switch (event) {
    case "push":
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

    await triggerEvent("merge_request", payload, record);
  } else {
    await triggerEvent("merge_request", payload, null);
  }
}

async function handleCreateBranch(payload) {
  // We only care about branches.
  if (payload.ref_type != "branch") {
    return;
  }

  const record = await linkBranch(payload.ref, payload.repository.html_url);
  await triggerEvent("branch", payload, record);
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

  aha.triggerServer(`aha-develop.gitlab.${event}.${payload.object_attributes.action}`, {
    record,
    payload,
  });
}
