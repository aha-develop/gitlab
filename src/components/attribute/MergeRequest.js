import React, { useEffect } from "react";
import { githubMrToMrLink, linkMergeRequestToRecord } from "../../lib/fields";
// import { getMrByUrl } from "../../lib/github/getMr";
const getMrByUrl = () => 'FIXME'
// import { prStatusCommit } from "../../lib/github/mrStatusCommit";
const mrStatusCommit = 'FIXME'
import { useGithubApi } from "../../lib/useGithubApi";
import { ExternalLink } from "../ExternalLink";
import { MrReviewStatus } from "../MrReviewStatus";
import { MrState } from "../MrState";
import { Status } from "../Status";

/**
 * @type {React.FC<{record:import("../../lib/fields").LinkableRecord, mr:import("../../lib/fields").MrLink}>}
 */
export const MergeRequest = ({ record, mr }) => {
  const originalMr = mr;

  if (mr.title) {
    mr = { ...mr, ...githubMrToMrLink(mr) };
  }

  const {
    authed,
    data: fetchedMr,
    loading,
    error,
    fetchData,
  } = useGithubApi(async (api) => {
    return await getMrByUrl(api, mr.url, {
      includeStatus: true,
      includeReviews: true,
    });
  });

  // If the reloaded PR has changed state then update the extension fields
  useEffect(() => {
    if (loading) return;
    if (!fetchedMr) return;

    const mrLink = githubMrToMrLink(fetchedMr);
    if (mrLink.state === originalMr.state) return;

    linkMergeRequestToRecord(fetchedMr, record);
  }, [fetchedMr, loading]);

  // Once fetched replace the prop with the fetched version
  if (authed && fetchedMr) {
    mr = githubMrToMrLink(fetchedMr);
  }

  return (
    <aha-flex align-items="center" justify-content="space-between" gap="5px">
      <span>
        <ExternalLink href={mr.url}>{mr.name}</ExternalLink>
      </span>
      <MrState mr={mr} />
      {loading && (
        <span className="mr-status">
          <aha-spinner />
        </span>
      )}
      {!loading && (!authed || !fetchedMr) && (
        <span className="mr-status">
          <aha-button onClick={fetchData} size="small" type="attribute">
            <aha-icon icon="fa-regular fa-refresh"></aha-icon>
          </aha-button>
        </span>
      )}
      {authed && fetchedMr && (
        <>
          <Status mrStatus={mrStatusCommit(fetchedMr)} />
          <MrReviewStatus mr={fetchedMr} />
        </>
      )}
    </aha-flex>
  );
};
