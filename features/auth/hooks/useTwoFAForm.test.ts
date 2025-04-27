import { act, renderHook } from '@testing-library/react';
import { useGenerateTOTP, useVerifyTOTP } from '../apis/totp';
import { useTwoFAForm } from './useTwoFAForm';

// Mock the auth hooks
jest.mock('../apis/totp', () => ({
  useGenerateTOTP: jest.fn(),
  useVerifyTOTP: jest.fn(),
}));

describe('useTwoFAForm', () => {
  const mockOnSuccess = jest.fn();
  const mockVerifyTOTP = jest.fn();
  const mockQrCodeData = { uri: 'test-uri' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useVerifyTOTP as jest.Mock).mockReturnValue({
      verifyTOTP: mockVerifyTOTP,
      isVerifying: false,
    });
    (useGenerateTOTP as jest.Mock).mockReturnValue({
      data: mockQrCodeData,
      isFetching: false,
      isSuccess: true,
    });
  });

  it('should initialize form with correct default values', () => {
    const { result } = renderHook(() => useTwoFAForm({ isSetup: true, onSuccess: mockOnSuccess }));

    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isVerifying).toBe(false);
  });

  it('should handle successful verification', async () => {
    mockVerifyTOTP.mockResolvedValueOnce({ success: true });
    const { result } = renderHook(() => useTwoFAForm({ isSetup: true, onSuccess: mockOnSuccess }));

    await act(async () => {
      await result.current.onSubmit({ code: '123456' });
    });

    expect(mockVerifyTOTP).toHaveBeenCalledWith('123456');
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('should handle verification failure', async () => {
    mockVerifyTOTP.mockRejectedValueOnce(new Error('Verification failed'));
    const { result } = renderHook(() => useTwoFAForm({ isSetup: true, onSuccess: mockOnSuccess }));

    await act(async () => {
      await result.current.onSubmit({ code: '123456' });
    });

    expect(mockVerifyTOTP).toHaveBeenCalledWith('123456');
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should return QR code data when in setup mode', () => {
    const { result } = renderHook(() => useTwoFAForm({ isSetup: true, onSuccess: mockOnSuccess }));

    expect(result.current.qrCodeData).toEqual(mockQrCodeData);
    expect(result.current.isSuccess).toBe(true);
  });

  it('should not return QR code data when not in setup mode', () => {
    (useGenerateTOTP as jest.Mock).mockReturnValue({
      data: undefined,
      isFetching: false,
      isSuccess: false,
    });

    const { result } = renderHook(() => useTwoFAForm({ isSetup: false, onSuccess: mockOnSuccess }));

    expect(result.current.qrCodeData).toBeUndefined();
    expect(result.current.isSuccess).toBe(false);
  });
});
