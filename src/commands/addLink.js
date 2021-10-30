import { linkMergeRequestToRecord } from "../lib/fields";
import { withGitHubApi } from "../lib/gitlab/api";
import { getPrByUrl } from "../lib/gitlab/getPr";

/**
 * @param {string} urlString
 */
function validPrUrl(urlString) {
  const url = new URL(urlString);
  return (
    url.origin === "https://gitlab.com" &&
    url.pathname.match(/\/[^\/]+\/[^\/]+\/pull\/\d+/)
  );
}

aha.on("addLink", async ({ record, context }) => {
  const prUrl = await aha.commandPrompt("Link URL", {
    placeholder: "Enter the URL to a merge request",
  });

  if (!validPrUrl(prUrl)) {
    throw new Error("Please enter a valid merge request URL");
  }

  await withGitHubApi(async (api) => {
    const pullRequest = await getPrByUrl(api, prUrl);
    await linkMergeRequestToRecord(pullRequest, record);
  });
});
