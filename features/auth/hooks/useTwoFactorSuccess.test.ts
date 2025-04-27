import { useRouter } from 'next/navigation';
import { act, renderHook } from '@testing-library/react';
import { useTimeout } from '@mantine/hooks';
import { useTwoFactorSuccess } from './useTwoFactorSuccess';

// Mock the hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@mantine/hooks', () => ({
  useTimeout: jest.fn(),
}));

describe('useTwoFactorSuccess', () => {
  const mockRouter = {
    replace: jest.fn(),
  };
  const mockStart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useTimeout as jest.Mock).mockReturnValue({ start: mockStart });
  });

  it('should initialize with default delay', () => {
    renderHook(() => useTwoFactorSuccess());

    expect(useTimeout).toHaveBeenCalledWith(expect.any(Function), 3000);
  });

  it('should use custom delay when provided', () => {
    renderHook(() => useTwoFactorSuccess({ redirectDelay: 5000 }));

    expect(useTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);
  });

  it('should call onSuccess and router.replace when timeout callback is executed', () => {
    const mockOnSuccess = jest.fn();
    const mockCallback = jest.fn();

    (useTimeout as jest.Mock).mockImplementation((callback) => {
      mockCallback.mockImplementation(callback);
      return { start: mockStart };
    });

    renderHook(() => useTwoFactorSuccess({ onSuccess: mockOnSuccess }));

    act(() => {
      mockCallback();
    });

    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockRouter.replace).toHaveBeenCalledWith('/');
  });

  it('should start the timeout when startRedirect is called', () => {
    const { result } = renderHook(() => useTwoFactorSuccess());

    act(() => {
      result.current.startRedirect();
    });

    expect(mockStart).toHaveBeenCalled();
  });
});
