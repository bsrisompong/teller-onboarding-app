import React, { ReactNode } from 'react';
import { Center, Container } from '@mantine/core';
import BackgroundParticles from '@/components/BackgroundParticles';
import styles from './PublicLayout.module.css';

interface PublicLayoutProps {
  children: ReactNode;
}

const PublicLayout = async ({ children }: PublicLayoutProps) => {
  return (
    <Container size="xl" className={styles.container}>
      <BackgroundParticles />
      <Center className={styles.center}>{children}</Center>
    </Container>
  );
};

export default PublicLayout;
