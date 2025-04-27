import { useState } from 'react';
import { IconFile } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import {
  Avatar,
  Box,
  Button,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useOnboardingStore } from '../stores/onboardingStore';

const mockConfirmPermission = new Promise((resolve, reject) => {
  setTimeout(() => {
    // success
    resolve({ success: true, status: 200 });
    // error
    // reject(new Error('ข้อมูลไม่ถูกต้องกรุณาตรวจสอบอีกครั้ง'));
  }, 3000);
});

export function VerifyForm() {
  const { customerInfo, uploadedFiles, applicationId, reset } = useOnboardingStore();
  const file = uploadedFiles[0];

  const { mutateAsync: confirmPermission, isPending } = useMutation({
    mutationFn: () => mockConfirmPermission,
  });

  const handleOpenConfirmModal = () => {
    modals.openConfirmModal({
      title: <Text fw={700}>ยืนยันข้อมูลและอนุมัติ</Text>,
      children: <Text>คุณต้องการยืนยันข้อมูลและอนุมัติหรือไม่?</Text>,
      labels: { confirm: 'ยืนยัน', cancel: 'ยกเลิก' },
      onConfirm: handleConfirm,
      centered: true,
      confirmProps: { color: 'green' },
    });
  };

  const handleConfirm = async () => {
    try {
      await confirmPermission();
      notifications.show({
        title: 'ยืนยันข้อมูลและอนุมัติ',
        message: 'ข้อมูลถูกยืนยันและอนุมัติ',
        color: 'green',
      });
      reset();
    } catch (error) {
      notifications.show({
        title: 'ยืนยันข้อมูลและอนุมัติ',
        message: 'ข้อมูลไม่ถูกยืนยันและอนุมัติ',
        color: 'red',
      });
    }
  };

  return (
    <Box maw={500} mx="auto" mt="xl">
      <Box>
        <Title order={2} ta="center">
          ตรวจสอบและยืนยันข้อมูล
        </Title>
        <Text c="gray.4" ta="center">
          Application Id : {applicationId}
        </Text>
      </Box>
      <Paper shadow="xs" p="md" mb="md">
        <Stack gap="xs">
          <Text fw={700}>ข้อมูลส่วนตัว</Text>
          <TextInput label="ชื่อ" value={customerInfo.name} readOnly variant="filled" mb="xs" />
          <TextInput
            label="นามสกุล"
            value={customerInfo.surname}
            readOnly
            variant="filled"
            mb="xs"
          />
          <TextInput
            label="หมายเลขบัตรประชาชน"
            value={customerInfo.citizenId}
            readOnly
            variant="filled"
            mb="xs"
          />
          <TextInput
            label="หมายเลขบัญชี"
            value={customerInfo.accountNumber}
            readOnly
            variant="filled"
            mb="xs"
          />
        </Stack>
      </Paper>
      <Paper shadow="xs" p="md" mb="md">
        <Text fw={700} mb="xs">
          เอกสารที่อัปโหลด
        </Text>
        {file ? (
          file.type.startsWith('image') ? (
            <Group>
              <Image src={file.base64} alt={file.name} width={60} radius="md" mr="sm" />
              <Text fw="bold">{file.name}</Text>
            </Group>
          ) : file.type === 'application/pdf' ? (
            <Group>
              <a href={file.base64} target="_blank" rel="noopener noreferrer">
                <Avatar size={32} radius="md" color="gray">
                  <IconFile size={18} />
                </Avatar>
              </a>
              <a
                href={file.base64}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline', color: '#228be6' }}
              >
                file name:<Text fw="bold">{file.name}</Text>
              </a>
            </Group>
          ) : (
            <Text fw="bold">{file.name}</Text>
          )
        ) : (
          <Text c="dimmed">ไม่มีเอกสารที่อัปโหลด</Text>
        )}
      </Paper>
      <Button fullWidth onClick={handleOpenConfirmModal} loading={isPending}>
        ยืนยันข้อมูลและอนุมัติ
      </Button>
    </Box>
  );
}
