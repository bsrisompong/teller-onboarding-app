'use client';

import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button, Paper, Stack, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
// config
import { GOOGLE_REDIRECT_URI } from '@/config/constants';

const LoginPage = () => {
  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: GOOGLE_REDIRECT_URI,
    onError: (err) => notifications.show({ title: 'Google Login Error', message: err.error }),
  });

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} ta="center" mt="md" mb={50}>
        Teller Login
      </Title>
      <form>
        <Stack>
          <TextInput label="Teller ID" placeholder="Enter your teller ID" size="md" />
          <TextInput label="TOTP Code" placeholder="Enter 6-digit code" size="md" maxLength={6} />
          <Button type="submit" size="md">
            Sign in
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default LoginPage;
