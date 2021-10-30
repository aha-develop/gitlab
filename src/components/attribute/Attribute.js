import { useAuth } from "@aha-app/aha-develop-react";
import React from "react";
import { Branches } from "./Branches";
import { Menu } from "./Menu";
import { MergeRequests } from "./MergeRequests";

export const Attribute = ({ fields, record }) => {
  const { error, authed } = useAuth(async () => {});
  const authError = error && <div>{error}</div>;

  const isLinked = [fields.branches, fields.mergeRequests].some(
    (ary) => ary?.length > 0
  );

  const gitlabLinks = isLinked ? (
    <aha-flex direction="column" gap="8px" justify-content="space-between">
      <Branches fields={fields} />
      <MergeRequests record={record} mrs={fields.mergeRequests}></MergeRequests>
    </aha-flex>
  ) : (
    <aha-flex direction="row" gap="8px" justify-content="space-between" style={{ padding: '2px 5px', color: 'var(--theme-tertiary-text)' }}>
      <aha-icon icon="fa-regular fa-code-branch type-icon" />
      <span>Include <strong>{ record.referenceNum }</strong> in your branch or MR name</span>
    </aha-flex>
  );

  return (
    <>
      <aha-flex align-items="center" justify-content="space-between" gap="5px">
        {authError}
        {gitlabLinks}
        <Menu record={record} />
      </aha-flex>
    </>
  );
};
