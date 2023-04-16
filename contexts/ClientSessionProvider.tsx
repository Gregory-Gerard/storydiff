'use client';

// This module exists for the sole purpose of cloning SessionProvider & adding the compiler directive above
// https://github.com/nextauthjs/next-auth/pull/5718

import React from 'react';
import { SessionProvider } from 'next-auth/react';

export const ClientSessionProvider: typeof SessionProvider = ({ children, ...props }) => {
  return <SessionProvider {...props}>{children}</SessionProvider>;
};
