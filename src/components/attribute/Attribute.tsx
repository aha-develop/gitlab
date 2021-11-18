import React from 'react';
import { useAuth } from '@aha-app/aha-develop-react';

import { Menu } from './Menu';
import { MergeRequests } from './MergeRequests';

export type AttributeProps = {
  record: Aha.RecordUnion;
  fields: IRecordExtensionFields;
};

export const Attribute = ({ fields, record }: AttributeProps) => {
  const { error, authed } = useAuth(async () => {});
  const authError = error && <div>{error}</div>;
  const isLinked = [fields.branches, fields.mergeRequests].some((ary) => ary && ary?.length > 0);

  return (
    <aha-flex align-items="center" justify-content="space-between" gap="5px">
      {authError}
      {isLinked ? (
        <aha-flex direction="column" gap="8px" justify-content="space-between">
          <MergeRequests record={record} mrs={fields?.mergeRequests ?? []}></MergeRequests>
        </aha-flex>
      ) : (
        <aha-flex
          direction="row"
          gap="8px"
          justify-content="space-between"
          style={{ padding: '2px 5px', color: 'var(--theme-tertiary-text)' }}>
          <aha-icon icon="fa-regular fa-code-branch type-icon" />
          <span>
            Include <strong>{record.referenceNum}</strong> in your branch or MR name
          </span>
        </aha-flex>
      )}
      <Menu record={record} />
    </aha-flex>
  );
};
