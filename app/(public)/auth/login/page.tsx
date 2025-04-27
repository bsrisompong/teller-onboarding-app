'use client';

import React from 'react';
import { IconBrandGoogleFilled } from '@tabler/icons-react';
import { Typewriter } from 'react-simple-typewriter';
import { Box, Button, Divider, Stack, Title } from '@mantine/core';
import { useGoogleAuthMutation } from '@/features/auth';

const LoginPage = () => {
  const { initiateAuth, isAuthLoading } = useGoogleAuthMutation();

  return (
    <Box p="xl" w="100%" maw={548}>
      <Stack gap="lg">
        <Title order={1} ta="center" mt="md">
          <Typewriter
            words={['Welcome', 'Please sign in to continue']}
            loop={1}
            cursor
            cursorStyle="|"
            typeSpeed={40}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </Title>

        <Divider />
        <Button
          type="button"
          size="md"
          onClick={() => initiateAuth()}
          loading={isAuthLoading}
          leftSection={<IconBrandGoogleFilled size={20} />}
        >
          Sign in with Google
        </Button>
      </Stack>
    </Box>
  );
};

export default LoginPage;
