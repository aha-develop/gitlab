import { useAuth, useClipboard } from '@aha-app/aha-develop-react';
import React from 'react';

import { getExtensionFields } from '@lib/fields';
import { Branches } from './Branches';
import { EmptyState } from './EmptyState';
import { Menu } from './Menu';
import { MergeRequests } from './MergeRequests';

export type AttributeProps = {
  record: Aha.RecordUnion;
  fields: IRecordExtensionFields;
};

export const Attribute = ({ fields, record }: AttributeProps, { identifier, settings }) => {
  const [isLoading, setLoading] = React.useState(false);
  const [branches, setBranches] = React.useState<IRecordExtensionFieldBranch[]>([]);
  const [mergeRequests, setMergeRequests] = React.useState<IExtensionFieldMergeRequest[]>([]);
  const { error, authed } = useAuth(async () => {});
  const [onCopy, copied] = useClipboard();
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

  if (isLinked) {
    return (
      <div className="mt-1 ml-1">
        <aha-flex align-items="center" justify-content="space-between" gap="5px">
          {authError}
          <Branches branches={branches ?? []} />
          <aha-button-group>
            <aha-button size="mini" onClick={(e) => onCopy(record.referenceNum)}>
              {copied ? 'Copied!' : 'Copy ID'}
            </aha-button>
            <Menu record={record} />
          </aha-button-group>
        </aha-flex>
        <aha-flex align-items="center" justify-content="space-between" gap="5px">
          <aha-flex direction="column" gap="8px" justify-content="space-between">
            <MergeRequests record={record} mrs={mergeRequests ?? []}></MergeRequests>
          </aha-flex>
        </aha-flex>
      </div>
    );
  } else {
    return <EmptyState record={record} />;
  }
};
