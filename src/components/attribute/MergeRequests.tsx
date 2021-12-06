import React from 'react';
import { MergeRequest } from './MergeRequest';

export type MergeRequestsProps = {
  record: Aha.RecordUnion;
  mrs: IExtensionFieldMergeRequest[];
};

export const MergeRequests = ({ record, mrs }: MergeRequestsProps) => {
  return (
    <div className="merge-requests">
      <aha-flex direction="column" gap="3px">
        {(mrs || []).map((mr, idx) => (
          <MergeRequest key={idx} record={record} mr={mr} />
        ))}
      </aha-flex>
    </div>
  );
};
