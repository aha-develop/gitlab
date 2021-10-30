import React from "react";
import { ExternalLink } from "../ExternalLink";
import { MrState } from "../MrState";

/**
 * @type {React.FC<{record:import("../../lib/fields").LinkableRecord, mr:import("../../lib/fields").MrLink}>}
 */
export const MergeRequest = ({ record, mr }) => {
  return (
    <aha-flex align-items="center" justify-content="space-between" gap="5px">
      <span>
        <ExternalLink href={mr.url}>{mr.name}</ExternalLink>
      </span>
      <MrState mr={mr} />
    </aha-flex>
  );
};
