import { fireEvent, screen, waitFor } from '@testing-library/react';
import { render } from '@/test-utils';
import { useOnboardingStore } from '../stores/onboardingStore';
import { UploadDocumentForm } from './UploadDocumentForm';

jest.mock('@mantine/notifications', () => ({
  notifications: { show: jest.fn() },
}));
jest.mock('@/utils', () => ({
  fileToBase64: jest.fn().mockResolvedValue('data:image/png;base64,MOCK_BASE64'),
}));

describe('UploadDocumentForm', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    jest.clearAllMocks();
  });

  it('renders the form with correct title and application ID', () => {
    render(<UploadDocumentForm />);
    expect(screen.getByText(/อัปโหลดเอกสารยืนยันตัวตน/)).toBeInTheDocument();
    expect(screen.getByText(/Application Id/)).toBeInTheDocument();
  });

  it('renders the dropzone with correct instructions', () => {
    render(<UploadDocumentForm />);
    expect(screen.getByText(/ลากและวางไฟล์ที่นี่/)).toBeInTheDocument();
    expect(screen.getByText(/คลิกเพื่อเลือกไฟล์/)).toBeInTheDocument();
  });

  it('handles file upload and shows preview for image files', async () => {
    render(<UploadDocumentForm />);
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const dropzone = screen.getByTestId('dropzone-input');
    const dataTransfer = {
      files: [file],
      items: [
        {
          kind: 'file',
          type: file.type,
          getAsFile: () => file,
        },
      ],
      types: ['Files'],
    };
    fireEvent.drop(dropzone, {
      dataTransfer,
    });
    await waitFor(() => {
      expect(screen.getByAltText('test.png')).toBeInTheDocument();
    });
  });

  it('handles file upload and shows preview for PDF files', async () => {
    render(<UploadDocumentForm />);
    const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
    const dropzone = screen.getByTestId('dropzone-input');
    const dataTransfer = {
      files: [file],
      items: [
        {
          kind: 'file',
          type: file.type,
          getAsFile: () => file,
        },
      ],
      types: ['Files'],
    };
    fireEvent.drop(dropzone, {
      dataTransfer,
    });
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
  });

  it('removes uploaded file when cancel button is clicked', async () => {
    render(<UploadDocumentForm />);
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const dropzone = screen.getByTestId('dropzone-input');
    const dataTransfer = {
      files: [file],
      items: [
        {
          kind: 'file',
          type: file.type,
          getAsFile: () => file,
        },
      ],
      types: ['Files'],
    };
    fireEvent.drop(dropzone, {
      dataTransfer,
    });
    await waitFor(() => {
      expect(screen.getByAltText('test.png')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/ยกเลิก\/เปลี่ยนแปลงไฟล์/));
    expect(screen.queryByAltText('test.png')).not.toBeInTheDocument();
  });

  it('shows error when file size exceeds limit', async () => {
    render(<UploadDocumentForm />);
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.png', { type: 'image/png' });
    const dropzone = screen.getByTestId('dropzone-input');
    const dataTransfer = {
      files: [largeFile],
      items: [
        {
          kind: 'file',
          type: largeFile.type,
          getAsFile: () => largeFile,
        },
      ],
      types: ['Files'],
    };
    fireEvent.drop(dropzone, {
      dataTransfer,
    });
    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toBeInTheDocument();
      const errorText = errorAlert.textContent;
      expect(errorText).toContain('5MB');
    });
  });

  it('calls onSuccess callback when file is uploaded and confirmed', async () => {
    const onSuccess = jest.fn();
    render(<UploadDocumentForm onSuccess={onSuccess} />);
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const dropzone = screen.getByTestId('dropzone-input');
    const dataTransfer = {
      files: [file],
      items: [
        {
          kind: 'file',
          type: file.type,
          getAsFile: () => file,
        },
      ],
      types: ['Files'],
    };
    fireEvent.drop(dropzone, {
      dataTransfer,
    });
    await waitFor(() => {
      expect(screen.getByAltText('test.png')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/ยืนยันการอัปโหลดเอกสาร/));
    expect(onSuccess).toHaveBeenCalled();
  });
});
