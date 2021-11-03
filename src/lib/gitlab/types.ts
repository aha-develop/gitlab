declare namespace Gitlab {
  type PullRequestReviewDecision =
    | "CHANGES_REQUESTED"
    | "APPROVED"
    | "REVIEW_REQUIRED";

  type StatusState = "EXPECTED" | "ERROR" | "FAILURE" | "SUCCESS" | "PENDING";

  interface MrLabel {
    color: string;
    name: string;
  }

  interface Context {
    context: string;
    description: string;
    targetUrl: string;
    state: StatusState;
  }

  interface CommitStatus {
    statusCheckRollup: { state: StatusState } | null;
    status: { contexts: Context[] } | null;
  }

  interface MrForLink {
    id: number;
    number: number;
    title: string;
    url: string;
    status: string;
    merged: boolean;
    repository: { url: string };
    headRef: { name: string } | null;
  }

  interface MrWithStatus extends MrForLink {
    commits: { nodes: { commit: CommitStatus }[] };
  }

  interface MrForReviewDecision extends MrForLink {
    reviewDecision: PullRequestReviewDecision;
    latestReviews: { nodes: { state: PullRequestReviewDecision }[] };
  }

  interface MrWithLabels extends MrForLink {
    labels: { nodes: MrLabel[] };
  }

  type MrForLinkWithStatus = MrForLink & MrWithStatus;

  type Mr = MrForLink &
    Partial<MrWithStatus & MrForReviewDecision & MrWithLabels>;
}