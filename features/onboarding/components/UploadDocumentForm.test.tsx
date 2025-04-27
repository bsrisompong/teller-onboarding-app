import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useOnboardingStore } from '../stores/onboardingStore';
import { UploadDocumentForm } from './UploadDocumentForm';

jest.mock('@mantine/notifications', () => ({
  notifications: { show: jest.fn() },
}));
jest.mock('../utils', () => ({
  fileToBase64: jest.fn().mockResolvedValue('data:image/png;base64,MOCK_BASE64'),
}));

describe('UploadDocumentForm', () => {
  beforeEach(() => {
    useOnboardingStore.getState().reset();
    jest.clearAllMocks();
  });

  it('renders dropzone and uploads a file', async () => {
    render(<UploadDocumentForm />);
    expect(screen.getByText(/อัปโหลดเอกสารยืนยันตัวตน/)).toBeInTheDocument();
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const dropzone = screen.getByText(/ลากและวางไฟล์ที่นี่/).closest('div');
    fireEvent.drop(dropzone!, {
      dataTransfer: { files: [file] },
    });
    await waitFor(() => {
      expect(screen.getByAltText('test.png')).toBeInTheDocument();
    });
  });

  it('removes a file after upload', async () => {
    render(<UploadDocumentForm />);
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const dropzone = screen.getByText(/ลากและวางไฟล์ที่นี่/).closest('div');
    fireEvent.drop(dropzone!, {
      dataTransfer: { files: [file] },
    });
    await waitFor(() => {
      expect(screen.getByAltText('test.png')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(/ยกเลิก\/เปลี่ยนแปลงไฟล์/));
    expect(screen.queryByAltText('test.png')).not.toBeInTheDocument();
  });

  it('shows error if confirm is clicked without a file', () => {
    render(<UploadDocumentForm />);
    fireEvent.click(screen.getByText(/ยืนยันการอัปโหลดเอกสาร/));
    expect(screen.getByText(/กรุณาอัปโหลดเอกสาร/)).toBeInTheDocument();
  });
});
