import { useRouter } from 'next/navigation';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/test-utils';
import TwoFactorSuccess from './TwoFactorSuccess';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('TwoFactorSuccess', () => {
  const mockReplace = jest.fn();
  const mockRouter = { replace: mockReplace };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should render success message and icon', () => {
    render(<TwoFactorSuccess />);

    expect(screen.getByTestId('two-factor-success')).toBeInTheDocument();
    expect(screen.getByTestId('success-icon')).toBeInTheDocument();
    expect(screen.getByTestId('success-message')).toBeInTheDocument();
    expect(screen.getByTestId('done-button')).toBeInTheDocument();
  });

  it('should call onDone prop when Done button is clicked', async () => {
    const mockOnDone = jest.fn();
    render(<TwoFactorSuccess onDone={mockOnDone} />);

    await userEvent.click(screen.getByTestId('done-button'));

    expect(mockOnDone).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('should navigate to home page when Done button is clicked without onDone prop', async () => {
    render(<TwoFactorSuccess />);

    await userEvent.click(screen.getByTestId('done-button'));

    expect(mockReplace).toHaveBeenCalledWith('/');
  });
});
