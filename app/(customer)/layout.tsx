'use client';

import React from 'react';
import { IconCalendar, IconClock, IconUser } from '@tabler/icons-react';
import { AppShell, Box, Divider, Group, Text } from '@mantine/core';
import { useOnboardingStore } from '@/features/onboarding';
import { useCurrentTime } from '@/hooks/useCurrentTime';

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  const { customerInfo } = useOnboardingStore();
  const currentTime = useCurrentTime();

  return (
    <AppShell
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{ width: 0, breakpoint: 'sm', collapsed: { mobile: true } }}
    >
      <AppShell.Header>
        <Group justify="space-between" align="center" h="100%" px="md">
          <Group gap="xl">
            <Group gap="xs">
              <IconUser size={20} color="#495057" />
              <Text size="sm" c="dimmed">
                ผู้ใช้งาน
              </Text>
              <Text size="sm" fw={500}>
                {customerInfo.name} {customerInfo.surname}
              </Text>
            </Group>
            <Divider orientation="vertical" />
            <Group gap="xs">
              <IconCalendar size={20} color="#495057" />
              <Text size="sm" c="dimmed">
                วันที่
              </Text>
              <Text size="sm" fw={500}>
                {currentTime.date}
              </Text>
            </Group>
            <Divider orientation="vertical" />
            <Group gap="xs">
              <IconClock size={20} color="#495057" />
              <Text size="sm" c="dimmed">
                เวลา
              </Text>
              <Text size="sm" fw={500}>
                {currentTime.time}
              </Text>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Box p="md">{children}</Box>
      </AppShell.Main>
      <AppShell.Footer>
        <Group justify="space-between" align="center" h="100%" px="md">
          <Text size="sm" c="dimmed">
            © 2024 TTB Bank. All rights reserved.
          </Text>
          <Text size="sm" fw={500}>
            {currentTime.date}
          </Text>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
};

export default CustomerLayout;
