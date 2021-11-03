import React from "react";
import { unlinkBranches, unlinkMergeRequests } from "../../lib/fields";

async function addLink(record) {
  await aha.command("aha-develop.gitlab.addLink", { record });
}

async function removeLinks(record) {
  await unlinkMergeRequests(record);
  await unlinkBranches(record);
}

export function Menu({ record }) {
  return (
    <aha-menu>
      <aha-button slot="button" type="attribute" size="small">
        <aha-icon icon="fa-solid fa-ellipsis"></aha-icon>
      </aha-button>
      <aha-menu-item onClick={() => addLink(record)}>
        Link merge request
      </aha-menu-item>
      <aha-menu-item onClick={() => removeLinks(record)}>
        Unlink merge requests
      </aha-menu-item>
    </aha-menu>
  );
}
