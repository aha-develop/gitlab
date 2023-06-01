import { useClipboard } from '@aha-app/aha-develop-react';
import { IDENTIFIER } from 'extension';
import { linkMergeRequestToRecord } from '@lib/fields';
import { withGitLabApi } from '@lib/gitlab/api';
import { getMRFromURL } from '@lib/gitlab/getMRFromURL';
import { validateMrURL } from '@lib/gitlab/validateMrURL';
import React, { useEffect, useState } from 'react';

const ICON = aha.iconForExtensionIdentifier(IDENTIFIER);
const LEARN_MORE_URL = 'https://github.com/aha-develop/gitlab';

type MenuProps = {
  record: Aha.ApplicationModel;
  onPaste: Function;
};

const Menu = ({ record, onPaste }: MenuProps) => {
  const handleSync = () => {
    aha.command(`${IDENTIFIER}.sync`, { record });
  };

  return (
    <aha-menu>
      <aha-button slot="button" type="attribute" size="mini">
        <aha-icon icon="fa-solid fa-ellipsis"></aha-icon>
      </aha-button>
      <aha-menu-item onClick={() => onPaste()}>Paste MR link</aha-menu-item>
      <aha-menu-item onClick={handleSync}>Scan GitLab</aha-menu-item>
      <hr />
      <aha-menu-item>
        <a href={LEARN_MORE_URL} target="_blank" rel="noopener noreferrer">
          <aha-icon icon="fa fa-external-link" />
          Read the docs
        </a>
      </aha-menu-item>
    </aha-menu>
  );
};

const EmptyStateBox = ({ children }) => (
  // @ts-ignore
  <aha-box class="m-0" style={{ color: 'var(--theme-secondary-text)' }}>
    <div style={{ margin: 'calc(-2em + 12px)' }}>{children}</div>
  </aha-box>
);

export const EmptyState: React.FC<{ record: Aha.RecordUnion }> = ({ record }) => {
  const [onCopy, copied] = useClipboard();
  const [pasteMode, setPasteMode] = useState<Boolean>(false);
  const [validation, setValidation] = useState<String | null>(null);
  const [hasConfiguredWebhook, setHasConfiguredWebhook] = useState<Boolean | null>(null);

  // aha-menu gets mad if you remove it from the DOM while the menu is open.
  // Wait 1 tick so the menu has a chance to unmount first.
  const viewPasteMode = () => {
    setTimeout(() => setPasteMode(true), 1);
  };

  const pasteLink = async (mrUrl: string) => {
    if (!validateMrURL(mrUrl)) {
      setValidation('Please enter a valid merge request URL');
      return;
    }

    const res = await withGitLabApi(getMRFromURL(mrUrl));
    if (res) {
      await linkMergeRequestToRecord(res, record);
    } else {
      setValidation('Could not link this merge request! Please enter a valid merge request URL!');
    }
  };

  // Song and dance to fetch installation status for webhook when component first loads
  useEffect(() => {
    aha.account
      .getExtensionField<boolean>(IDENTIFIER, 'webhookConfigured')
      .then((hasConfiguredWebhook) => setHasConfiguredWebhook(hasConfiguredWebhook || false));
  }, []);

  if (hasConfiguredWebhook === null) {
    return <aha-spinner />;
  }

  if (pasteMode) {
    return (
      <EmptyStateBox>
        <aha-flex justify-content="space-between" align-items="flex-start">
          <div className="mb-2" style={{ fontSize: 14, fontWeight: 500 }}>
            <aha-icon icon={ICON} class="mr-2" />
            Paste merge request link
          </div>
          <aha-button size="mini" onClick={() => setPasteMode(false)}>
            Cancel
          </aha-button>
        </aha-flex>
        <input
          type="text"
          placeholder="https://gitlab.com/..."
          style={{
            display: 'block',
            width: 'calc(100% - 16px)',
            marginBottom: 0
          }}
          onChange={(e) => pasteLink(e.target.value)}
          autoFocus
        />
        {validation}
      </EmptyStateBox>
    );
  }

  if (!hasConfiguredWebhook) {
    return (
      <EmptyStateBox>
        <aha-flex justify-content="space-between" align-items="flex-start">
          <div className="mb-2" style={{ fontSize: 14, fontWeight: 500 }}>
            <aha-icon icon={ICON} class="mr-2" />
            Set up GitLab
          </div>
          <aha-button-group>
            <aha-button size="mini" href={LEARN_MORE_URL} target="_blank" rel="noopener noreferrer">
              Learn more
            </aha-button>
            <Menu record={record} onPaste={viewPasteMode} />
          </aha-button-group>
        </aha-flex>
        <div style={{ fontSize: 12 }}>
          <a href={`/settings/account/extensions/${IDENTIFIER}`} rel="noopener noreferrer" target="_blank">
            Install the webhook
          </a>
          &nbsp;to automatically link GitLab merge requests
        </div>
      </EmptyStateBox>
    );
  }

  return (
    <EmptyStateBox>
      <aha-flex justify-content="space-between" align-items="flex-start">
        <div className="mb-2" style={{ fontSize: 14, fontWeight: 500 }}>
          <aha-icon icon={ICON} class="mr-2" />
          No merge request linked
        </div>
        <aha-button-group>
          <aha-button size="mini" onClick={(e) => onCopy(record.referenceNum)}>
            {copied ? 'Copied!' : 'Copy ID'}
          </aha-button>
          <Menu record={record} onPaste={viewPasteMode} />
        </aha-button-group>
      </aha-flex>
      <div style={{ fontSize: 12 }}>
        Include <strong>{record.referenceNum}</strong> in your branch or MR name to link automatically
      </div>
    </EmptyStateBox>
  );
};
