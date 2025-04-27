import { useTwoFAForm } from '@/features/auth/hooks/useTwoFAForm';
import { fireEvent, render, screen, waitFor } from '@/test-utils';
import TwoFAForm from './TwoFAForm';

// Mock the useTwoFAForm hook
jest.mock('@/features/auth/hooks/useTwoFAForm');

describe('TwoFAForm', () => {
  const mockOnSuccess = jest.fn();
  const mockUseTwoFAForm = useTwoFAForm as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTwoFAForm.mockReturnValue({
      register: jest.fn().mockReturnValue({}),
      handleSubmit: jest.fn().mockImplementation((callback) => (e: React.FormEvent) => {
        e.preventDefault();
        callback({ code: '123456' });
      }),
      errors: {},
      isSubmitting: false,
      isVerifying: false,
      qrCodeData: { uri: 'test-uri' },
      isQrCodeLoading: false,
      isSuccess: true,
      onSubmit: jest.fn().mockImplementation(async () => {
        mockOnSuccess();
      }),
    });
  });

  it('should render the form with correct elements', () => {
    render(<TwoFAForm isSetup onSuccess={mockOnSuccess} />);

    expect(screen.getByTestId('two-factor-form')).toBeInTheDocument();
    expect(screen.getByTestId('verify-button')).toBeInTheDocument();
    expect(screen.getByTestId('code-input')).toBeInTheDocument();
  });

  it('should show loading state on button when submitting', () => {
    mockUseTwoFAForm.mockReturnValue({
      register: jest.fn().mockReturnValue({}),
      handleSubmit: jest.fn().mockImplementation((callback) => (e: React.FormEvent) => {
        e.preventDefault();
        callback({ code: '123456' });
      }),
      errors: {},
      isSubmitting: true,
      isVerifying: false,
      qrCodeData: { uri: 'test-uri' },
      isQrCodeLoading: false,
      isSuccess: true,
      onSubmit: jest.fn().mockImplementation(async () => {
        mockOnSuccess();
      }),
    });

    render(<TwoFAForm isSetup onSuccess={mockOnSuccess} />);

    expect(screen.getByTestId('verify-button')).toBeDisabled();
  });

  it('should show error message when there is an error', () => {
    const errorMessage = 'Invalid OTP';
    mockUseTwoFAForm.mockReturnValue({
      register: jest.fn().mockReturnValue({}),
      handleSubmit: jest.fn().mockImplementation((callback) => (e: React.FormEvent) => {
        e.preventDefault();
        callback({ code: '123456' });
      }),
      errors: { code: { message: errorMessage } },
      isSubmitting: false,
      isVerifying: false,
      qrCodeData: { uri: 'test-uri' },
      isQrCodeLoading: false,
      isSuccess: true,
      onSubmit: jest.fn().mockImplementation(async () => {
        mockOnSuccess();
      }),
    });

    render(<TwoFAForm isSetup onSuccess={mockOnSuccess} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should call onSuccess when form is submitted successfully', async () => {
    const mockSubmit = jest.fn().mockImplementation(async () => {
      mockOnSuccess();
    });

    mockUseTwoFAForm.mockReturnValue({
      register: jest.fn().mockReturnValue({}),
      handleSubmit: jest.fn().mockImplementation((callback) => (e: React.FormEvent) => {
        e.preventDefault();
        callback({ code: '123456' });
      }),
      errors: {},
      isSubmitting: false,
      isVerifying: false,
      qrCodeData: { uri: 'test-uri' },
      isQrCodeLoading: false,
      isSuccess: true,
      onSubmit: mockSubmit,
    });

    render(<TwoFAForm isSetup onSuccess={mockOnSuccess} />);

    // Fill in the code input
    const codeInput = screen.getByTestId('code-input');
    fireEvent.change(codeInput, { target: { value: '123456' } });

    // Submit the form
    fireEvent.click(screen.getByTestId('verify-button'));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
