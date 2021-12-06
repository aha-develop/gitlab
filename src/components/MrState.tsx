import React from 'react';
// @ts-ignore
import { titleize } from 'https://cdn.skypack.dev/inflected';

const icon = (state: Gitlab.MergeRequestState) => {
  switch (state) {
    case 'opened':
      return 'code-branch';
    case 'merged':
      return 'code-merge';
    case 'closed':
      return 'times-circle';
    case 'locked':
      return 'lock';
  }
};

export type MrStateProps = {
  mr: Gitlab.MR;
};

export const MrState = ({ mr }: MrStateProps) => {
  return (
    <span className={`pr-state pr-state-${mr?.state?.toLowerCase() ?? ''}`}>
      <aha-flex gap="4px">
        <aha-icon icon={'fa-regular fa-' + icon(mr?.state ?? 'opened')}></aha-icon>
        <span>{titleize(mr.state)}</span>
      </aha-flex>
    </span>
  );
};
