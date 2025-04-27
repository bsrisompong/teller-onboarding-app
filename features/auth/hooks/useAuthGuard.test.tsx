import React from 'react';
import { useRouter } from 'next/navigation';
import { render } from '@testing-library/react';
import { notifications } from '@mantine/notifications';
import { useDeleteSession, useGetSession } from '@/features/auth';
import { useAuthGuard } from './useAuthGuard';

jest.mock('@/features/auth', () => ({
  useGetSession: jest.fn(),
  useDeleteSession: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@mantine/notifications', () => ({
  notifications: { show: jest.fn() },
}));

function TestComponent() {
  useAuthGuard();
  return null;
}

describe('useAuthGuard', () => {
  const push = jest.fn();
  const deleteSession = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
    (useDeleteSession as jest.Mock).mockReturnValue({ mutate: deleteSession });
  });

  it('returns session and isLoading from useGetSession', () => {
    (useGetSession as jest.Mock).mockReturnValue({
      data: { user: 'test' },
      isLoading: false,
      isError: false,
      error: null,
    });
    let session, isLoading;
    function Capture() {
      const result = useAuthGuard();
      session = result.session;
      isLoading = result.isLoading;
      return null;
    }
    render(<Capture />);
    expect(session).toEqual({ user: 'test' });
    expect(isLoading).toBe(false);
  });

  it('shows notification, redirects, and deletes session on 401 error', () => {
    (useGetSession as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error('401'),
    });
    render(<TestComponent />);
    expect(notifications.show).toHaveBeenCalledWith({
      title: 'Session expired',
      message: 'Please login again',
      color: 'red',
    });
    expect(push).toHaveBeenCalledWith('/auth/login');
    expect(deleteSession).toHaveBeenCalled();
  });

  it('does not trigger side effects when isLoading is true', () => {
    (useGetSession as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    });
    render(<TestComponent />);
    expect(notifications.show).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(deleteSession).not.toHaveBeenCalled();
  });

  it('does not trigger side effects when error is not 401', () => {
    (useGetSession as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error('500'),
    });
    render(<TestComponent />);
    expect(notifications.show).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(deleteSession).not.toHaveBeenCalled();
  });
});
