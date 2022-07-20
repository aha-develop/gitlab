declare namespace Gitlab {
  type ID = string;

  type MergeStatus = 'CANNOT_BE_MERGED' | 'CANNOT_BE_MERGED_RECHECK' | 'CAN_BE_MERGED' | 'CHECKING' | 'UNCHECKED';

  type MergeRequestState = 'all' | 'closed' | 'locked' | 'merged' | 'opened';

  type MergeRequestAction = 'open' | 'close' | 'reopen' | 'update' | 'approved' | 'unapproved' | 'approval' | 'unapproval' | 'merge;'

  interface Connections<T> {
    count?: number;
    edges?: Edge<T>[];
    nodes?: T[];
    pageInfo: PageInfo;
  }

  interface PageInfo {
    endCursor?: string;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    startCursor?: string;
  }

  interface Edge<T> {
    cursor?: string;
    node?: T;
  }

  interface Project {
    id?: ID;
    name?: string;
    webUrl?: string;
    mergeRequests?: Connections<MR>;
  }

  interface Label {
    color?: string;
    description?: string;
    descriptionHtml?: string;
    id?: ID;
    textColor?: string;
    title?: string;
  }

  interface MR {
    id?: ID;
    iid?: string;
    approved?: boolean;
    commitCount?: number;
    createdAt?: number;
    defaultMergeCommitMessage?: string;
    defaultMergeCommitMessageWithDescription?: string;
    description?: string;
    descriptionHtml?: string;
    labels?: Connections<Label>;
    mergeStatusEnum?: MergeStatus;
    mergeable?: boolean;
    mergedAt?: number;
    project?: Project;
    projectId?: ID;
    sourceBranch?: string;
    state?: MergeRequestState;
    targetBranch?: string;
    title?: string;
    titleHtml?: string;
    updatedAt?: number;
    webUrl?: string;
  }

  type MRWithProject = MR & {
    projectId?: ID;
    projectName?: string;
    projectWebUrl?: string;
  };

  interface User {
    id: number;
    name?: string;
    email?: string;
    username?: string;
    avatar_url?: string;
  }
}
