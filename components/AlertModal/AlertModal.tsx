'use client';

import { useEffect, useState } from 'react';
import { Button, Center, Modal, Text } from '@mantine/core';
import { useTimeout } from '@mantine/hooks';

interface AlertModalProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  timer?: number; // seconds
  onTimeout?: () => void;
  continueLabel?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  opened,
  onClose,
  title,
  children,
  timer,
  onTimeout,
  continueLabel = 'Continue',
}) => {
  const [countdown, setCountdown] = useState(timer ?? 0);

  const { start, clear } = useTimeout(
    () => {
      if (onTimeout) {
        onTimeout();
      }
    },
    (timer ?? 0) * 1000
  );

  useEffect(() => {
    if (opened && timer) {
      setCountdown(timer);
      start();
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            return prev - 1;
          }
          clearInterval(interval);
          return 0;
        });
      }, 1000);
      return () => {
        clear();
        clearInterval(interval);
      };
    }
  }, [opened, timer]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      title={title}
      centered
      transitionProps={{ transition: 'fade-up', duration: 200 }}
    >
      <Center>
        <div>
          {children}
          <Center mt="md">
            <Button onClick={onClose} variant="white">
              {continueLabel}
            </Button>
          </Center>
        </div>
      </Center>
    </Modal>
  );
};

export default AlertModal;
