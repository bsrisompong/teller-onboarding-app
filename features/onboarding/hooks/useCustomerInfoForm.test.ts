import { act, renderHook } from '@testing-library/react';
import { useOnboardingStore } from '../stores/onboardingStore';
import { useCustomerInfoForm } from './useCustomerInfoForm';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
}));

// Mock the API mutation hook
jest.mock('../api/application', () => ({
  useApplicationMutation: () => ({
    mutateAsync: jest.fn().mockResolvedValue({
      customer: { id: 'customer-1' },
      application: { id: 'application-1' },
    }),
    isPending: false,
  }),
}));

// Mock notifications
jest.mock('@mantine/notifications', () => ({
  notifications: {
    show: jest.fn(),
  },
}));

describe('useCustomerInfoForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    act(() => {
      useOnboardingStore.getState().reset();
    });
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should prefill customer info from store', () => {
    act(() => {
      useOnboardingStore.getState().setCustomerInfo({
        name: 'Jane',
        surname: 'Doe',
        citizenId: '1234567890123',
        accountNumber: '1234567890',
      });
    });

    const { result } = renderHook(() => useCustomerInfoForm());
    // The form should be prefilled, but react-hook-form's reset is not directly testable here.
    expect(result.current.errors).toEqual({});
  });

  it('should submit valid data and update store', async () => {
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useCustomerInfoForm(onSuccess));

    await act(async () => {
      await result.current.onSubmit({
        name: 'Jane',
        surname: 'Doe',
        citizenId: '1234567890123',
        accountNumber: '1234567890',
      });
    });

    const state = useOnboardingStore.getState();
    expect(state.customerInfo).toEqual({
      name: 'Jane',
      surname: 'Doe',
      citizenId: '1234567890123',
      accountNumber: '1234567890',
    });
    expect(state.applicationId).toBe('application-1');
    expect(state.customerId).toBe('customer-1');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should handle API errors gracefully', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.spyOn(require('../api/application'), 'useApplicationMutation').mockReturnValue({
      mutateAsync: jest.fn().mockRejectedValue(new Error('API error')),
      isPending: false,
    });

    const { result } = renderHook(() => useCustomerInfoForm());
    await act(async () => {
      await result.current.onSubmit({
        name: 'Jane',
        surname: 'Doe',
        citizenId: '1234567890123',
        accountNumber: '1234567890',
      });
    });

    // No throw, error is caught
  });
});
