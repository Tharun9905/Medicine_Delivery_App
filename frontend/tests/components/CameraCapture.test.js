import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CameraCapture from '../../src/components/common/CameraCapture';

// Mock MediaDevices API
const mockGetUserMedia = jest.fn();
const mockEnumerateDevices = jest.fn();

Object.defineProperty(window.navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: mockGetUserMedia,
    enumerateDevices: mockEnumerateDevices
  }
});

// Mock HTMLVideoElement
Object.defineProperty(HTMLVideoElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockResolvedValue()
});

describe('CameraCapture Component', () => {
  const mockOnCapture = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Camera permission granted and works', () => {
    test('should initialize camera successfully', async () => {
      const mockStream = {
        getTracks: jest.fn().mockReturnValue([{ stop: jest.fn() }]),
        getVideoTracks: jest.fn().mockReturnValue([{ getSettings: () => ({ facingMode: 'user' }) }])
      };

      mockGetUserMedia.mockResolvedValue(mockStream);
      mockEnumerateDevices.mockResolvedValue([
        { deviceId: 'device1', kind: 'videoinput', label: 'Front Camera' },
        { deviceId: 'device2', kind: 'videoinput', label: 'Back Camera' }
      ]);

      render(<CameraCapture onCapture={mockOnCapture} />);

      // Click to activate camera
      const activateButton = screen.getByText('Activate Camera');
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(mockGetUserMedia).toHaveBeenCalledWith({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
      });
    });

    test('should capture image successfully', async () => {
      const mockStream = {
        getTracks: jest.fn().mockReturnValue([{ stop: jest.fn() }]),
        getVideoTracks: jest.fn().mockReturnValue([{ getSettings: () => ({ facingMode: 'user' }) }])
      };

      mockGetUserMedia.mockResolvedValue(mockStream);
      
      // Mock canvas context
      const mockCanvas = document.createElement('canvas');
      const mockContext = {
        drawImage: jest.fn(),
        getImageData: jest.fn().mockReturnValue(new ImageData(1, 1))
      };
      mockCanvas.getContext = jest.fn().mockReturnValue(mockContext);
      mockCanvas.toBlob = jest.fn((callback) => {
        callback(new Blob(['test'], { type: 'image/jpeg' }));
      });

      jest.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') return mockCanvas;
        return document.createElement(tagName);
      });

      render(<CameraCapture onCapture={mockOnCapture} />);

      const activateButton = screen.getByText('Activate Camera');
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(screen.getByText('Capture')).toBeInTheDocument();
      });

      const captureButton = screen.getByText('Capture');
      fireEvent.click(captureButton);

      await waitFor(() => {
        expect(mockOnCapture).toHaveBeenCalled();
      });
    });
  });

  describe('Camera permission denied', () => {
    test('should handle camera permission denied gracefully', async () => {
      const permissionError = new Error('Permission denied');
      permissionError.name = 'NotAllowedError';
      mockGetUserMedia.mockRejectedValue(permissionError);

      render(<CameraCapture onCapture={mockOnCapture} />);

      const activateButton = screen.getByText('Activate Camera');
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(screen.getByText(/camera permission denied/i)).toBeInTheDocument();
      });
    });

    test('should handle camera not found error', async () => {
      const deviceError = new Error('Device not found');
      deviceError.name = 'NotFoundError';
      mockGetUserMedia.mockRejectedValue(deviceError);

      render(<CameraCapture onCapture={mockOnCapture} />);

      const activateButton = screen.getByText('Activate Camera');
      fireEvent.click(activateButton);

      await waitFor(() => {
        expect(screen.getByText(/no camera found/i)).toBeInTheDocument();
      });
    });
  });
});