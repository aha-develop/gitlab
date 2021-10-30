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

  console.log('[GitLab]', fields)

  const gitlabLinks = isLinked ? (
    <aha-flex direction="column" gap="8px" justify-content="space-between">
      <Branches fields={fields} />
      <MergeRequests record={record} mrs={fields.mergeRequests}></MergeRequests>
    </aha-flex>
  ) : (
    <div>Not linked</div>
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
