declare interface IRecordExtensionFields {
  branches?: IRecordExtensionFieldBranch[];
  mergeRequests?: IExtensionFieldMergeRequest[];
}

declare type IRecordExtensionField = keyof IRecordExtensionFields;

declare interface IRecordExtensionFieldBranch {
  id?: string;
  name?: string;
  url?: string;
}

declare interface IAccountExtensionFields {
  gitlabMRs?: IExtensionFieldMergeRequest[];
}

declare interface IExtensionFieldMergeRequest {
  id: string;
  iid: string;
  title?: string;
  webUrl?: string;
  sourceBranch?: string;
  targetBranch?: string;
  projectId?: string;
  projectWebUrl?: string;
  state?: Gitlab.MergeRequestState;
  ahaReference?: {
    type: string;
    referenceNum: string;
  };
}

declare type IAccountExtensionField = keyof IAccountExtensionFields;
