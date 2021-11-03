import React from "react";
// @ts-ignore
import { titleize } from "https://cdn.skypack.dev/inflected";

/**
 * @param {'opened'|'merged'|'closed'} state
 */
const icon = (state) => {
  switch (state) {
    case "opened":
      return "code-branch";
    case "merged":
      return "code-merge";
    case "closed":
      return "code-branch";
  }
};

export const MrState = ({ mr }) => {
  return (
    <span className={`pr-state pr-state-${mr.state.toLowerCase()}`}>
      <aha-flex gap="4px">
        <aha-icon
          icon={"fa-regular fa-" + icon(mr.state.toLowerCase())}
        ></aha-icon>
        <span>{titleize(mr.state)}</span>
      </aha-flex>
    </span>
  );
};
