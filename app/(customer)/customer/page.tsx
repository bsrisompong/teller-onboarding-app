'use client';

import Image from 'next/image';
import {
  IconCash,
  IconChevronRight,
  IconCreditCard,
  IconTransfer,
  IconWallet,
} from '@tabler/icons-react';
import {
  Anchor,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useOnboardingStore } from '@/features/onboarding';

export const CustomerPage = () => {
  const { applicationId, customerInfo } = useOnboardingStore();
  return (
    <Container size="xl">
      <Grid gutter="md">
        <Grid.Col span={3}>
          <Stack gap="md">
            <Paper withBorder shadow="sm" p="lg" radius="md">
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  ยินดีต้อนรับ
                </Text>
                <Text size="xl" fw={700}>
                  {customerInfo.name} {customerInfo.surname}
                </Text>
                <Divider my="sm" />
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">
                    เลขที่บัญชี
                  </Text>
                  <Text size="lg" fw={500}>
                    {customerInfo.accountNumber}
                  </Text>
                </Stack>
              </Stack>
            </Paper>
            <Paper withBorder shadow="sm" p="lg" radius="md">
              <Stack gap="xs">
                <Text size="sm" c="dimmed">
                  ลิงก์สำคัญ
                </Text>
                <Anchor href="https://www.google.com" target="_blank" rel="noreferrer" size="sm">
                  <Group gap="xs">
                    <Text>เว็บไซต์ธนาคาร</Text>
                    <IconChevronRight size={16} />
                  </Group>
                </Anchor>
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>

        <Grid.Col span={6}>
          <Stack gap="md">
            <Paper withBorder shadow="sm" p="lg" radius="md">
              <Stack gap="md">
                <Group grow>
                  <Button
                    variant="light"
                    color="blue"
                    size="lg"
                    leftSection={<IconWallet size={20} />}
                  >
                    เช็คธนาคาร
                  </Button>
                  <Button
                    variant="light"
                    color="red"
                    size="lg"
                    leftSection={<IconWallet size={20} />}
                  >
                    ปิดบัญชี
                  </Button>
                </Group>
                <Group grow>
                  <Button
                    variant="light"
                    color="green"
                    size="lg"
                    leftSection={<IconCash size={20} />}
                  >
                    ฝากเงิน
                  </Button>
                  <Button
                    variant="light"
                    color="yellow"
                    size="lg"
                    leftSection={<IconCash size={20} />}
                  >
                    ถอนเงิน
                  </Button>
                </Group>
                <Group grow>
                  <Button
                    variant="light"
                    color="violet"
                    size="lg"
                    leftSection={<IconTransfer size={20} />}
                  >
                    โอนเงิน
                  </Button>
                  <Button
                    variant="light"
                    color="cyan"
                    size="lg"
                    leftSection={<IconCreditCard size={20} />}
                  >
                    จ่ายเงิน
                  </Button>
                </Group>
              </Stack>
            </Paper>

            <Paper withBorder shadow="sm" p="lg" radius="md">
              <Stack gap="md">
                <Title order={4}>ข่าวสารล่าสุด</Title>
                <Stack gap="xs">
                  <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                  </Text>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>

        <Grid.Col span={3}>
          <Stack gap="md">
            <Paper withBorder shadow="sm" p="lg" radius="md">
              <Stack align="center" gap="md">
                <Image
                  src="/ttb_bank_logo.png"
                  alt="TTB Bank Logo"
                  width={355}
                  height={185}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '355px',
                    objectFit: 'contain',
                  }}
                  priority
                />
              </Stack>
            </Paper>
            <Paper withBorder shadow="sm" p="lg" radius="md">
              <Stack gap="md">
                <Title order={4}>ประกาศสำคัญ</Title>
                <Text size="sm" c="dimmed">
                  ข่าวสารและประกาศสำคัญจากธนาคาร
                </Text>
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default CustomerPage;
