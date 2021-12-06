# GitLab for Aha! Develop

This is an extension for [Aha! Develop](https://www.aha.io/develop) providing integration with GitLab.

It provides these contributions:

- `Links attribute` - Link Aha! Develop records to GitHub branches and pull requests. See the status checks and approvals for the PR.
- `Webhook` - Automatically links pull requests to records if the PR title starts with the record reference number.

The GitLab extension triggers events that other extensions can use for automation. For example, an extension can listen for the label event:

```js
aha.on({ event: 'aha-develop.gitlab.mr.update' }, async ({ record, payload }) => {
  if (mrIncludesLabel(payload, 'documentation')) {
    const task = new aha.models.Task();
    task.record = record;
    task.name = 'Write documentation';
    task.body = `Todo created from GitLab PR ${payload["web_url"]}`;
    await task.save();
  }
});
```

## Installing the extension

**Note: In order to install an extension into your Aha! Develop account, you must be an account administrator.**

1. Install the GitLab extension by clicking [here](https://secure.aha.io/settings/account/extensions/install?url=https%3A%2F%2Fsecure.aha.io%2Fextensions%2Faha-develop.gitlab.gz).

2. Configure a webhook in GitLab. The extension will automatically link Aha! records to branches and pull requests in GitLab if you include the Aha! reference number (like `APP-123`) in the name of the branch or pull request. To enable this:

   - In Aha! go to Settings -> Account -> Extensions -> GitLab Integration -> Webhook from GitLab. Copy the hidden URL.

   - In GitLab go to each repo that you want to integrate with Aha!. In Settings -> Webhooks create a new webhook. The URL is the URL you copied from the extension. Select the following individual events: Push events and Merge request events. Enable the webhook.

    - Instead of doing this at the repo level, it is also possible to create an organization-wide webhook that wil work for all repos.

  3. Configure the extension with your repos. In Aha! go to Settings -> Account -> Extensions -> GitLab Integration. In the Related repositories section add each repo that should be considered when looking for PRs that match a feature ID.

## Working on the extension

Install `aha-cli`:

```sh
npm install -g aha-cli
```

Clone the repo:

```sh
git clone https://github.com/aha-develop/gitlab.git
```

Install required modules:

```sh
yarn install
```

**Note: In order to install an extension into your Aha! Develop account, you must be an account administrator.**

Install the extension into Aha! and set up a watcher:

```sh
aha extension:install
aha extension:watch
```

Now, any change you make inside your working copy will automatically take effect in your Aha! account.

## Building

When you have finished working on your extension, package it into a `.gz` file so that others can install it:

```sh
aha extension:build
```

After building, you can upload the `.gz` file to a publicly accessible URL, such as a GitHub release, so that others can install it using that URL.

To learn more about developing Aha! Develop extensions, including the API reference, the full documentation is located here: [Aha! Develop Extension API](https://www.aha.io/support/develop/extensions)
