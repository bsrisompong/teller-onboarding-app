import { fireEvent, screen, waitFor } from '@testing-library/react';
import { render } from '@/test-utils';
import { useOnboardingStore } from '../stores/onboardingStore';
import { CustomerInfoForm } from './CustomerInfoForm';

jest.mock('@mantine/notifications', () => ({
  notifications: { show: jest.fn() },
}));

describe('CustomerInfoForm', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    jest.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<CustomerInfoForm />);
    expect(screen.getByTestId('customer-name')).toBeInTheDocument();
    expect(screen.getByTestId('customer-surname')).toBeInTheDocument();
    expect(screen.getByTestId('customer-citizenId')).toBeInTheDocument();
    expect(screen.getByTestId('customer-accountNumber')).toBeInTheDocument();
  });

  it('submits valid data', async () => {
    render(<CustomerInfoForm />);
    fireEvent.change(screen.getByTestId('customer-name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByTestId('customer-surname'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByTestId('customer-citizenId'), {
      target: { value: '1234567890123' },
    });
    fireEvent.change(screen.getByTestId('customer-accountNumber'), {
      target: { value: '1234567890' },
    });
    fireEvent.click(screen.getByText('ยืนยันการกรอกข้อมูล'));
    await waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      expect(require('@mantine/notifications').notifications.show).toHaveBeenCalled();
    });
  });
});
