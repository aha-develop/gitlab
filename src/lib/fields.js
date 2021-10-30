import { IDENTIFIER } from "../extension";

const MERGE_REQUESTS_FIELD = "mergeRequests";
const BRANCHES_FIELD = "branches";

/**
 * @typedef {Aha.ReferenceInterface & Aha.HasExtensionFields} LinkableRecord
 */

/**
 * @typedef MrLink
 * @mrop {number} id
 * @mrop {string} name
 * @mrop {string} url
 * @mrop {string} state
 */

/**
 * @typedef AccountMr
 * @mrop {string} id
 * @mrop {number} number
 * @mrop {[string, string]} ahaReference
 */

/**
 * Append a field/value pair to the given record.
 *
 * @param {Aha.ApplicationModel & Aha.HasExtensionFields} record
 * @param {string} fieldName
 * @param {*} newValue
 */
async function appendField(record, fieldName, newValue) {
  // Link to Aha! record.
  console.log(
    `Link to ${record.typename}:${record["referenceNum"] || record.uniqueId}`
  );

  await replaceField(record, fieldName, (value) => {
    /** @type {{id:any}[]} */
    const list = [...(value || [])];
    const existing = list.findIndex((item) => item.id == newValue.id);

    if (existing > -1) {
      list.splice(existing, 1, newValue);
    } else {
      list.push(newValue);
    }

    return list;
  });
}

/**
 * @template T
 * @param {Aha.HasExtensionFields} record
 * @param {string} fieldName
 * @param {((value: T|null) => T | Promise<T>)} replacer
 */
async function replaceField(record, fieldName, replacer) {
  const fieldValue = await record.getExtensionField(IDENTIFIER, fieldName);
  const newValue = await replacer(fieldValue);
  await record.setExtensionField(IDENTIFIER, fieldName, newValue);
}

/**
 * @param {number} number
 * @param {string} ref
 */
function accountMrId(number, ref) {
  return [number, ref].join("");
}

/**
 * @param {*} mr
 * @returns {MrLink}
 */
function gitlabMrToMrLink(mr) {
  return {
    id: mr.number,
    name: mr.title,
    url: mr.html_url || mr.url,
    state: mr.merged ? "merged" : mr.state,
  };
}

/**
 * @param {Github.MrForLink} mr
 * @param {LinkableRecord} record
 */
async function linkMergeRequestToRecord(mr, record) {
  await appendField(record, MERGE_REQUESTS_FIELD, gitlabMrToMrLink(mr));

  await appendField(aha.account, MERGE_REQUESTS_FIELD, {
    id: accountMrId(mr.number, record.referenceNum),
    mrNumber: mr.number,
    ahaReference: [record.typename, record.referenceNum],
  });

  if (mr.headRef) {
    await linkBranchToRecord(mr.headRef.name, mr.repository.url, record);
  }
}

/**
 * @param {Github.MrForLink} mr
 */
async function linkMergeRequest(mr) {
  const record = await referenceToRecord(mr.title);

  if (record) {
    await linkMergeRequestToRecord(mr, record);
  }

  return record;
}

/**
 * @param {LinkableRecord} record
 * @param {*} number
 */
async function unlinkMergeRequest(record, number) {
  await replaceField(record, MERGE_REQUESTS_FIELD, (mrs) => {
    if (mrs) {
      return mrs.filter((mr) => mr.id != number);
    } else {
      return [];
    }
  });

  await replaceField(aha.account, MERGE_REQUESTS_FIELD, (mrs) => {
    if (mrs) {
      return mrs.filter(
        (mr) => mr.id == accountMrId(number, record.referenceNum)
      );
    } else {
      return [];
    }
  });
}

/**
 * @param {Aha.ReferenceInterface & Aha.HasExtensionFields} record
 */
async function unlinkMergeRequests(record) {
  /** @type {MrLink[]} */
  const mrs =
    (await record.getExtensionField(IDENTIFIER, MERGE_REQUESTS_FIELD)) || [];
  const ids = mrs.map((mr) => accountMrId(mr.id, record.referenceNum));

  await replaceField(
    aha.account,
    MERGE_REQUESTS_FIELD,
    (/** @type {AccountMr[]} */ accountMrs) => {
      if (!accountMrs) return [];
      return accountMrs.filter((accountMr) => !ids.includes(accountMr.id));
    }
  );

  await record.setExtensionField(IDENTIFIER, MERGE_REQUESTS_FIELD, []);
}

export async function allMrs() {
  const mrs = await aha.account.getExtensionField(
    IDENTIFIER,
    MERGE_REQUESTS_FIELD
  );
  return mrs || [];
}

/**
 * @param {LinkableRecord} record
 * @param {string} branchName
 * @param {string} repoUrl
 */
async function linkBranchToRecord(branchName, repoUrl, record) {
  await appendField(record, BRANCHES_FIELD, {
    id: branchName,
    name: branchName,
    url: `${repoUrl}/-/tree/${branchName}`,
  });
}

/**
 * @param {string} branchName
 * @param {string} repoUrl
 */
async function linkBranch(branchName, repoUrl) {
  const record = await referenceToRecord(branchName);
  if (record) {
    await linkBranchToRecord(branchName, repoUrl, record);
    return record;
  }
}

/**
 * @param {Aha.HasExtensionFields} record
 */
async function unlinkBranches(record) {
  await record.setExtensionField(IDENTIFIER, BRANCHES_FIELD, []);
}

/**
 * @param {string} str
 * @returns {Promise<(Aha.HasExtensionFields & Aha.ReferenceInterface)|null>}
 */
export async function referenceToRecord(str) {
  const ahaReference = extractReference(str);
  if (!ahaReference) {
    return null;
  }
  console.log(
    `Searching for ${ahaReference.type} ref ${ahaReference.referenceNum}`
  );

  const RecordClass = aha.models[ahaReference.type];
  if (!RecordClass) {
    console.log(`Unknown record type ${ahaReference.type}`);
    return null;
  }

  return await RecordClass.select("id", "referenceNum").find(
    ahaReference.referenceNum
  );
}

/**
 * @param {string} name
 */
function extractReference(name) {
  let matches;

  // Requirement
  if ((matches = name.match(/[a-z]{1,10}-[0-9]+-[0-9]+/i))) {
    return {
      type: "Requirement",
      referenceNum: matches[0],
    };
  }
  // Epic
  if ((matches = name.match(/[a-z]{1,10}-E-[0-9]+/i))) {
    return {
      type: "Epic",
      referenceNum: matches[0],
    };
  }
  // Feature
  if ((matches = name.match(/[a-z]{1,10}-[0-9]+/i))) {
    return {
      type: "Feature",
      referenceNum: matches[0],
    };
  }

  return null;
}

export {
  appendField,
  linkMergeRequest as linkMergeRequest,
  linkMergeRequestToRecord as linkMergeRequestToRecord,
  unlinkMergeRequest,
  unlinkMergeRequests,
  linkBranch,
  unlinkBranches,
  gitlabMrToMrLink as githubMrToMrLink,
};
