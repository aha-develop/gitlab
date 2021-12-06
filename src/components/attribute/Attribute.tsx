import React from 'react';
import { useAuth } from '@aha-app/aha-develop-react';

import { Menu } from './Menu';
import { MergeRequests } from './MergeRequests';
import { Branches } from './Branches';
import { IDENTIFIER } from '@lib/extension';
import { getExtensionFields } from '@lib/fields';

export type AttributeProps = {
  record: Aha.RecordUnion;
  fields: IRecordExtensionFields;
};

export const Attribute = ({ fields, record }: AttributeProps, { identifier, settings }) => {
  const [isLoading, setLoading] = React.useState(false);
  const [branches, setBranches] = React.useState<IRecordExtensionFieldBranch[]>([]);
  const [mergeRequests, setMergeRequests] = React.useState<IExtensionFieldMergeRequest[]>([]);
  const { error, authed } = useAuth(async () => {});
  const authError = error && <div>{error}</div>;
  const isLinked = [branches, mergeRequests].some((ary) => ary && ary?.length > 0);

  React.useEffect(() => {
    getFields();
  }, [authed, fields]);

  const getFields = async () => {
    setLoading(true);
    const branches = await getExtensionFields('branches', record);
    setBranches(branches as any);
    const mergeRequests = await getExtensionFields('mergeRequests', record);
    setMergeRequests(mergeRequests as any);
    setLoading(false);
  };

  if (isLoading) {
    return <aha-spinner />;
  }

  return (
    <aha-flex align-items="center" justify-content="space-between" gap="5px">
      {authError}
      {isLinked ? (
        <aha-flex direction="column" gap="8px" justify-content="space-between">
          <Branches branches={branches ?? []} />
          <MergeRequests record={record} mrs={mergeRequests ?? []}></MergeRequests>
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
