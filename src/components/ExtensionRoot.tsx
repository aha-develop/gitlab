import React from 'react';
import { AuthProvider } from '@aha-app/aha-develop-react';

import { Styles } from './Styles';

/**
 * Set up the styles and auth provider
 */
export const ExtensionRoot = ({ children }) => {
  return (
    <>
      <Styles />
      <AuthProvider serviceName="gitlab" serviceParameters={{}}>
        {children}
      </AuthProvider>
    </>
  );
};
