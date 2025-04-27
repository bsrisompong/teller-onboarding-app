import { ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

function render(ui: ReactElement, { ...renderOptions } = {}) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <MantineProvider>{children}</MantineProvider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
export { render };
