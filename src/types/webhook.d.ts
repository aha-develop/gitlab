declare namespace Webhook {
  interface Payload {
    id: number;
    user?: Gitlab.User;
    labels?: Gitlab.Label[];
    project?: Project;
    event_type?: EventType;
    object_attributes?: ObjectAttributes;

    // push hook fields
    ref?: string;
    after?: string;
    before?: string;
    message?: string;
    user_id?: number;
    user_name?: string;
    event_name?: 'push';
    project_id?: number;
    user_email?: string;
    repository?: Repository;
  }

  interface Repository {
    url?: string;
    name?: string;
    homepage?: string;
    description?: string;
    git_ssh_url?: string;
    git_http_url?: string;
    visibility_level?: number;
  }

  type EventType = 'merge_request' | 'note' | 'issue';

  interface Project {
    id: number;
    url?: string;
    name?: string;
    ssh_url?: string;
    web_url?: string;
    homepage?: string;
    http_url?: string;
    namespace?: string;
    avatar_url?: string;
    description?: string;
    git_ssh_url?: string;
    git_http_url?: string;
    ci_config_path?: string;
    default_branch?: string;
    path_with_namespace?: string;
  }

  interface ObjectAttributes {
    id?: string;
    iid?: number;
    url?: string;
    state?: Gitlab.MergeRequestState;
    title?: string;
    source?: Project;
    target?: Project;
    state_id?: number;
    author_id?: number;
    description?: string;
    merge_status: Gitlab.MergeStatus;
    source_branch?: string;
    target_branch?: string;
  }
}
