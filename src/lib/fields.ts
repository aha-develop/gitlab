import { IDENTIFIER } from '../extension';

/**
 * Link Merge Request to Aha Record
 *
 * @param mr
 * @param record
 */
export const linkMergeRequestToRecord = async (mr: Gitlab.MR, record: Aha.RecordUnion) => {
  const mrLink = gitlabMrToMrLink(mr);

  await appendFieldToRecord(record, 'mergeRequests', [
    {
      ...mrLink
    }
  ]);

  await appendFieldToAccount('gitlabMRs', [
    {
      ...mrLink,
      ahaReference: {
        type: record?.typename,
        referenceNum: record?.referenceNum
      }
    }
  ]);

  if (mr.sourceBranch) {
    await linkBranchToRecord(mr.sourceBranch, mr.project?.webUrl ?? '', record);
  }
};

/**
 * Append a field/value pair to the given record.
 *
 * @param record
 * @param fieldName
 * @param newValue
 */
const appendField = async <T = any>(
  record: Aha.RecordUnion | Aha.Account,
  fieldName: IAccountExtensionField | IRecordExtensionField,
  newValue?: T
) => {
  console.log(`Link to ${record.typename}:${record['referenceNum'] || record.uniqueId}`);

  await replaceField(record, fieldName, (value) => {
    if (Array.isArray(value) || Array.isArray(newValue)) {
      const list = [...(value || [])];

      ((newValue ?? []) as any[]).forEach((e) => {
        const existing = list.findIndex((item) => item.id == e?.id);
        if (existing > -1) {
          list.splice(existing, 1, e);
        } else {
          list.push(e);
        }
      });

      return list;
    } else if (typeof newValue === 'object') {
      return {
        ...value,
        ...newValue
      };
    } else {
      return newValue;
    }
  });
};

/**
 * Append a field in record
 *
 * @param fieldName
 * @param newValue
 * @returns
 */
export const appendFieldToAccount = (
  fieldName: IAccountExtensionField,
  newValue: IAccountExtensionFields[IAccountExtensionField]
) => {
  return appendField(aha.account, fieldName, newValue);
};

/**
 * Append a field in account
 *
 * @param record
 * @param fieldName
 * @param newValue
 * @returns
 */
export const appendFieldToRecord = async (
  record: Aha.RecordUnion,
  fieldName: IRecordExtensionField,
  newValue: IRecordExtensionFields[IRecordExtensionField]
) => {
  return appendField(record, fieldName, newValue);
};

/**
 * Replace Extension Fields
 *
 * @param record
 * @param fieldName
 * @param replacer
 */
const replaceField = async (
  record: Aha.RecordUnion | Aha.Account,
  fieldName: IAccountExtensionField | IRecordExtensionField,
  replacer: (val: any) => any
) => {
  const fieldValue = await record.getExtensionField(IDENTIFIER, fieldName);
  const newValue = await replacer(fieldValue);
  await record.setExtensionField(IDENTIFIER, fieldName, newValue);
};

/**
 * Generate MR Id for account
 *
 * @param number
 * @param ref
 * @returns
 */
const accountMrId = (number?: string | number, ref?: string | number) => {
  return [number, ref].join('_');
};

/**
 *
 * @param mr
 * @returns
 */
export const gitlabMrToMrLink = (mr: Gitlab.MR): IExtensionFieldMergeRequest => {
  return {
    id: mr.id ?? '',
    iid: mr.iid ?? '',
    title: mr.title ?? '',
    webUrl: mr.webUrl,
    state: mr.state,
    sourceBranch: mr?.sourceBranch,
    targetBranch: mr?.targetBranch,
    projectId: mr?.projectId,
    projectWebUrl: mr?.project?.webUrl
  };
};

/**
 * Link Merge Request to Aha Record
 *
 * @param mr
 * @returns
 */
export const linkMergeRequest = async (mr: Gitlab.MR) => {
  let record;
  if (mr?.id) {
    record = await referenceToRecordFromId(mr.id);
  }

  if (!record && mr?.title) {
    record = await referenceToRecordFromTitle(mr.title ?? '');
  }

  if (!record && mr?.sourceBranch) {
    record = await referenceToRecordFromTitle(mr.sourceBranch ?? '');
  }

  if (record) {
    await linkMergeRequestToRecord(mr, record);
  }

  return record;
};

/**
 * UnLink Merge Request
 *
 * @param record
 * @param number
 */
export const unlinkMergeRequest = async (record: Aha.RecordUnion, id: string) => {
  await replaceField(record, 'gitlabMRs', (mrs) => {
    if (mrs) {
      return mrs.filter((mr) => mr.id != id);
    } else {
      return [];
    }
  });

  await replaceField(aha.account, 'gitlabMRs', (mrs) => {
    if (mrs) {
      return mrs.filter((mr) => mr.id == accountMrId(id, record.referenceNum));
    } else {
      return [];
    }
  });
};

export const unlinkMergeRequests = async (record: Aha.RecordUnion) => {
  const ids: string[] = [];
  await replaceField(record, 'mergeRequests', (recordMrs: IExtensionFieldMergeRequest[]) => {
    if (!recordMrs) return [];
    recordMrs.forEach((e) => {
      ids.push(e.id);
    });
    return;
  });

  await replaceField(aha.account, 'gitlabMRs', (accountMrs: IExtensionFieldMergeRequest[]) => {
    if (!accountMrs) return [];
    return accountMrs.filter((accountMr) => !ids.includes(accountMr.id));
  });
};

export const getExtensionFields = async (
  fieldName: IAccountExtensionField | IRecordExtensionField,
  record: Aha.RecordUnion | Aha.Account = aha.account
): Promise<IAccountExtensionFields[IAccountExtensionField] | IRecordExtensionFields[IRecordExtensionField]> => {
  return (await record.getExtensionField(IDENTIFIER, fieldName)) as any;
};

/**
 *
 * @param branchName
 * @param repoUrl
 * @param record
 */
export const linkBranchToRecord = async (branchName: string, repoUrl: string, record: Aha.RecordUnion) => {
  await appendFieldToRecord(record, 'branches', [
    {
      id: branchName,
      name: branchName,
      url: `${repoUrl}/-/tree/${branchName}`
    }
  ]);
};

export const linkBranch = async (branchName: string, repoUrl: string) => {
  const record = await referenceToRecordFromTitle(branchName);
  if (record) {
    await linkBranchToRecord(branchName, repoUrl, record);
    return record;
  }
};

export const unlinkBranches = async (record: Aha.RecordUnion) => {
  await record.setExtensionField(IDENTIFIER, 'branches', []);
};

/**
 * Get Aha Record from Mr title or branch name
 *
 * @param str
 * @returns
 */
export const referenceToRecordFromTitle = async (str: string): Promise<Aha.RecordUnion | null> => {
  const ahaReference = extractReference(str);

  if (!ahaReference) {
    return null;
  }
  console.log(`Searching for ${ahaReference.type} ref ${ahaReference.referenceNum}`);

  const RecordClass = aha.models[ahaReference.type];
  if (!RecordClass) {
    console.log(`Unknown record type ${ahaReference.type}`);
    return null;
  }

  return await RecordClass.select('id', 'referenceNum').find(ahaReference.referenceNum);
};

/**
 * Get Aha Record from Mr Id
 *
 * @param str
 * @returns
 */
export const referenceToRecordFromId = async (str: string): Promise<Aha.RecordUnion | null> => {
  const mrs = (await getExtensionFields('gitlabMRs')) as IExtensionFieldMergeRequest[];
  const mr = mrs?.find((e) => `${e?.id}` === `${str}`);
  const { type, referenceNum } = mr?.ahaReference ?? {};

  const RecordClass = aha.models[type as any];
  if (!RecordClass) {
    console.log(`Unknown record type ${type}`);
    return null;
  }

  return await RecordClass.select('id', 'referenceNum').find(referenceNum);
};

/**
 * @param {string} name
 */
function extractReference(name) {
  let matches;

  // Requirement
  if ((matches = name.match(/[a-z0-9]{1,10}-[0-9]+-[0-9]+/i))) {
    return {
      type: 'Requirement',
      referenceNum: matches[0]
    };
  }

  // Epic
  if ((matches = name.match(/[a-z0-9]{1,10}-E-[0-9]+/i))) {
    return {
      type: 'Epic',
      referenceNum: matches[0]
    };
  }

  // Feature
  if ((matches = name.match(/[a-z0-9]{1,10}-[0-9]+/i))) {
    return {
      type: 'Feature',
      referenceNum: matches[0]
    };
  }

  return null;
}
