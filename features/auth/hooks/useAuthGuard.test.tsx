import React from 'react';
import { render } from '@testing-library/react';
import { useAuthGuard } from './useAuthGuard';
import { useSession, useDeleteSession } from '@/features/auth';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';

jest.mock('@/features/auth', () => ({
  useSession: jest.fn(),
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

  it('returns session and isLoading from useSession', () => {
    (useSession as jest.Mock).mockReturnValue({ data: { user: 'test' }, isLoading: false, isError: false, error: null });
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
    (useSession as jest.Mock).mockReturnValue({ data: null, isLoading: false, isError: true, error: new Error('401') });
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
    (useSession as jest.Mock).mockReturnValue({ data: null, isLoading: true, isError: false, error: null });
    render(<TestComponent />);
    expect(notifications.show).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(deleteSession).not.toHaveBeenCalled();
  });

  it('does not trigger side effects when error is not 401', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null, isLoading: false, isError: true, error: new Error('500') });
    render(<TestComponent />);
    expect(notifications.show).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    expect(deleteSession).not.toHaveBeenCalled();
  });
});
