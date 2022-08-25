import React from 'react';
import { Attribute } from '../components/attribute/Attribute';
import { ExtensionRoot } from '../components/ExtensionRoot';

const links: Aha.RenderExtension = ({ record, fields }) => {
  if (!record) return;

  return (
    <ExtensionRoot>
      <Attribute fields={fields as IRecordExtensionFields} record={record as unknown as Aha.RecordUnion} />
    </ExtensionRoot>
  );
};

aha.on('links', links);
