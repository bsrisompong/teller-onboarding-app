// styles
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dropzone/styles.css';
import '../theme/style.css';

//
import React from 'react';
import { GeistSans } from 'geist/font/sans';
import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import { API_MOCKING } from '@/config/constants';
import { MSWWrapper } from '@/libs/msw';
//
import AppProvider from '@/providers/AppProvider';

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default async function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" {...mantineHtmlProps} className={GeistSans.className}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <AppProvider>{API_MOCKING ? <MSWWrapper>{children}</MSWWrapper> : children}</AppProvider>
      </body>
    </html>
  );
}
