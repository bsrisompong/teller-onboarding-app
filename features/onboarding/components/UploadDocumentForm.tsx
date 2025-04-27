import { useState } from 'react';
import { IconAlertCircle, IconFile } from '@tabler/icons-react';
import { nanoid } from 'nanoid/non-secure';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { notifications } from '@mantine/notifications';
import { fileToBase64 } from '@/utils';
import { useOnboardingStore } from '../stores/onboardingStore';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function UploadDocumentForm({ onSuccess }: { onSuccess?: () => void }) {
  const { applicationId, addUploadedFile, uploadedFiles, removeUploadedFile, setCurrentStep } =
    useOnboardingStore();
  const [error, setError] = useState('');
  const file = uploadedFiles[0];

  const handleDrop = async (files: FileWithPath[]) => {
    setError('');
    if (!files.length) {
      setError('กรุณาเลือกไฟล์');
      return;
    }
    // Remove previous file from store if any
    if (file) {
      removeUploadedFile(file.id);
    }
    const newFile = files[0];
    const base64 = await fileToBase64(newFile);
    addUploadedFile({
      id: nanoid(),
      name: newFile.name,
      type: newFile.type,
      base64,
    });
  };

  const handleRemove = () => {
    if (file) {
      removeUploadedFile(file.id);
    }
    setError('');
  };

  const handleConfirm = () => {
    if (!file) {
      setError('กรุณาอัปโหลดเอกสาร');
      return;
    }
    notifications.show({
      title: 'อัปโหลดเอกสารสำเร็จ',
      message: 'เอกสารถูกอัปโหลดเรียบร้อย',
      color: 'green',
    });
    setCurrentStep(2);
    if (onSuccess) onSuccess();
  };

  return (
    <Box maw={400} mx="auto">
      <Stack gap="md" mt="md" align="center">
        <Box mb="lg">
          <Title order={2} ta="center">
            อัปโหลดเอกสารยืนยันตัวตน
          </Title>
          <Text c="gray.4">Application Id : {applicationId}</Text>
        </Box>
        {error && (
          <Alert color="red" icon={<IconAlertCircle size={16} />}>
            <Text c="red.5">{error}</Text>
          </Alert>
        )}
        {!file ? (
          <Dropzone
            onDrop={handleDrop}
            onReject={() => setError('ขนาดไฟล์ต้องไม่เกิน 5MB')}
            rejectColor="none"
            accept={['application/pdf', 'image/*']}
            maxSize={MAX_SIZE}
          >
            <Text ta="center">
              ลากและวางไฟล์ที่นี่ หรือ
              <br />
              คลิกเพื่อเลือกไฟล์ (PDF, รูปภาพ, สูงสุด 5MB)
            </Text>
          </Dropzone>
        ) : (
          <Stack gap="md" mt="md" w="100%">
            <Group>
              {file.type.startsWith('image') ? (
                <Image src={file.base64} alt={file.name} width={200} radius="md" />
              ) : file.type === 'application/pdf' ? (
                <Stack align="center" gap="lg" flex={1}>
                  <a
                    href={`data:application/pdf;base64,${file.base64}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Avatar size={96} radius="md" color="gray">
                      <IconFile size={48} />
                    </Avatar>
                  </a>
                  <a
                    href={`data:application/pdf;base64,${file.base64}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'underline', color: '#228be6' }}
                  >
                    <Text fw="bold">{file.name}</Text>
                  </a>
                </Stack>
              ) : (
                <Text>{file.name}</Text>
              )}
            </Group>
            <Button type="button" variant="outline" onClick={handleRemove}>
              ยกเลิก/เปลี่ยนแปลงไฟล์
            </Button>
          </Stack>
        )}
        <Divider flex={1} />
        <Button type="button" fullWidth disabled={!file} onClick={handleConfirm}>
          ยืนยันการอัปโหลดเอกสาร
        </Button>
      </Stack>
    </Box>
  );
}
