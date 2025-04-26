import { Loader as MantineLoader, LoaderProps as MantineLoaderProps } from '@mantine/core';
import styles from './Loader.module.css';

export interface LoaderProps extends MantineLoaderProps {
  label?: string;
  fullScreen?: boolean;
}

export function Loader({ label, fullScreen, ...props }: LoaderProps) {
  const containerClass = fullScreen ? styles.fullScreen : styles.container;

  return (
    <div className={containerClass}>
      <div className={styles.loaderWrapper}>
        <MantineLoader {...props} />
        {label && <span className={styles.label}>{label}</span>}
      </div>
    </div>
  );
}
