'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IconChevronDown, IconLogout } from '@tabler/icons-react';
import { AppShell, Avatar, Group, Menu, Text } from '@mantine/core';
import { useDeleteSession, useGetSession } from '@/features/auth';
import classes from './Header.module.css';

function Header() {
  const { data: session } = useGetSession();
  const { mutateAsync: logout } = useDeleteSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push('/auth/login');
    }
  };

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between" className={classes.content}>
        <Image src="/logo.svg" alt="logo" width={60} height={60} />
        <Group>
          <Menu width={200}>
            <Menu.Target>
              <Group>
                <Avatar src={session?.picture} radius="xl" color="blue" size={36} alt="avatar" />
                <IconChevronDown size={24} stroke={1.5} />
              </Group>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>
                <Text fw={500}>{session?.name}</Text>
                <Text size="sm" c="dimmed">
                  {session?.email}
                </Text>
              </Menu.Label>
              <Menu.Divider />
              <Menu.Item leftSection={<IconLogout />} onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  );
}

export default Header;
