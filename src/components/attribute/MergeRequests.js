import React from "react";
import { MergeRequest } from "./MergeRequest";

/**
 * @type {React.FC<{record: import("../../lib/fields").LinkableRecord, mrs:import("../../lib/fields").MrLink[]}>}
 */
export const MergeRequests = ({ record, mrs }) => {
  const mergeRequests = (mrs || []).map((mr, idx) => (
    <MergeRequest key={idx} record={record} mr={mr} />
  ));

  return (
    <div className="pull-requests">
      <aha-flex direction="column" gap="3px">
        {mergeRequests}
      </aha-flex>
    </div>
  );
};
