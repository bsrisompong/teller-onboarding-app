'use client';

import React from 'react';
import { Button, Paper, Stack, TextInput, Title } from '@mantine/core';
import { useGoogleAuthMutation } from '@/features/auth';

const LoginPage = () => {
  const { initiateAuth, isAuthLoading } = useGoogleAuthMutation();

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} ta="center" mt="md" mb={50}>
        Teller Login
      </Title>
      <form>
        <Stack>
          <TextInput label="Teller ID" placeholder="Enter your teller ID" size="md" />
          <TextInput label="TOTP Code" placeholder="Enter 6-digit code" size="md" maxLength={6} />
          <Button type="button" size="md" onClick={() => initiateAuth()} loading={isAuthLoading}>
            Sign in with Google
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default LoginPage;
