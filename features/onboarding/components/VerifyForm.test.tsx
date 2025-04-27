import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useOnboardingStore } from '../stores/onboardingStore';
import { VerifyForm } from './VerifyForm';

jest.mock('@mantine/notifications', () => ({
  notifications: { show: jest.fn() },
}));
jest.mock('@mantine/modals', () => ({
  modals: { openConfirmModal: jest.fn(({ onConfirm }) => onConfirm && onConfirm()) },
}));

describe('VerifyForm', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    jest.clearAllMocks();
    useOnboardingStore.getState().setCustomerInfo({
      name: 'John',
      surname: 'Doe',
      citizenId: '1234567890123',
      accountNumber: '1234567890',
    });
    useOnboardingStore.getState().addUploadedFile({
      id: '1',
      name: 'test.png',
      type: 'image/png',
      base64: 'data:image/png;base64,MOCK_BASE64',
    });
  });

  it('renders customer info and file preview', () => {
    render(<VerifyForm />);
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByAltText('test.png')).toBeInTheDocument();
  });

  it('shows confirmation modal and resets on confirm', async () => {
    render(<VerifyForm />);
    fireEvent.click(screen.getByText(/ยืนยันข้อมูลและอนุมัติ/));
    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      expect(require('@mantine/notifications').notifications.show).toHaveBeenCalled();
    });
    // After reset, file should not be present
    expect(screen.queryByAltText('test.png')).not.toBeInTheDocument();
  });
});
