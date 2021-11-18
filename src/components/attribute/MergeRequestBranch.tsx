import React, { useState } from 'react';

import { ExternalLink } from '../ExternalLink';

export type MergeRequestBranchProps = {
  mr: IExtensionFieldMergeRequest;
};

const MergeRequestBranch = ({ mr }: MergeRequestBranchProps) => {
  const [copied, setCopied] = useState(false);

  const onCopy = (name) => {
    navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <aha-flex gap="4px">
      {mr?.sourceBranch && (
        <>
          <span className="type-icon">
            <aha-icon icon="fa-regular fa-code-branch type-icon" />
          </span>
          <a
            href={mr?.projectWebUrl && mr?.sourceBranch ? `${mr.projectWebUrl}/-/tree/${mr.sourceBranch}` : '#'}
            target="_blank"
            rel="noopener noreferrer">
            {mr.sourceBranch}
          </a>
          <a
            href="#"
            onClick={() => onCopy(mr?.sourceBranch)}
            style={{
              color: copied ? 'var(--aha-green-600)' : ''
            }}>
            <aha-icon icon={'fa-regular fa-' + (copied ? 'check' : 'clipboard')}></aha-icon>
          </a>
        </>
      )}
      <aha-icon icon="fa-regular fa-arrow-right type-icon" />
      {mr?.targetBranch && (
        <>
          <span className="type-icon">
            <aha-icon icon="fa-regular fa-code-branch type-icon" />
          </span>
          <a
            href={mr?.projectWebUrl && mr?.targetBranch ? `${mr?.projectWebUrl}/-/tree/${mr?.targetBranch}` : '#'}
            target="_blank"
            rel="noopener noreferrer">
            {mr.targetBranch}
          </a>
          <a
            href="#"
            onClick={() => onCopy(mr?.sourceBranch)}
            style={{
              color: copied ? 'var(--aha-green-600)' : ''
            }}>
            <aha-icon icon={'fa-regular fa-' + (copied ? 'check' : 'clipboard')}></aha-icon>
          </a>
        </>
      )}
    </aha-flex>
  );
};

export default MergeRequestBranch;
