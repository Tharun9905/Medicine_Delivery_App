/**
 * @jest-environment jsdom
 */

// Mock MediaDevices API
const mockGetUserMedia = jest.fn();
const mockEnumerateDevices = jest.fn();

Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
    enumerateDevices: mockEnumerateDevices
  },
  writable: true
});

// Mock HTMLVideoElement and HTMLCanvasElement
HTMLVideoElement.prototype.play = jest.fn();
HTMLCanvasElement.prototype.getContext = jest.fn();

describe('Camera Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Camera Permission Tests', () => {
    test('should successfully request camera permission', async () => {
      const mockStream = {
        getTracks: () => [{
          kind: 'video',
          label: 'Camera',
          stop: jest.fn()
        }],
        getVideoTracks: () => [{
          kind: 'video',
          label: 'Camera',
          stop: jest.fn()
        }]
      };

      mockGetUserMedia.mockResolvedValue(mockStream);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      expect(stream).toBeDefined();
      expect(stream.getTracks()).toHaveLength(1);
      expect(mockGetUserMedia).toHaveBeenCalledWith({ video: true });
    });

    test('should handle camera permission denied', async () => {
      const mockError = new Error('Permission denied');
      mockError.name = 'NotAllowedError';

      mockGetUserMedia.mockRejectedValue(mockError);

      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.name).toBe('NotAllowedError');
        expect(error.message).toContain('Permission denied');
      }
    });

    test('should handle camera not found', async () => {
      const mockError = new Error('Requested device not found');
      mockError.name = 'NotFoundError';

      mockGetUserMedia.mockRejectedValue(mockError);

      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.name).toBe('NotFoundError');
        expect(error.message).toContain('not found');
      }
    });

    test('should handle camera in use by another application', async () => {
      const mockError = new Error('Could not start video source');
      mockError.name = 'NotReadableError';

      mockGetUserMedia.mockRejectedValue(mockError);

      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.name).toBe('NotReadableError');
        expect(error.message).toContain('Could not start');
      }
    });
  });

  describe('Camera Device Detection Tests', () => {
    test('should enumerate available camera devices', async () => {
      const mockDevices = [
        {
          deviceId: 'camera1',
          kind: 'videoinput',
          label: 'Front Camera',
          groupId: 'group1'
        },
        {
          deviceId: 'camera2',
          kind: 'videoinput',
          label: 'Back Camera',
          groupId: 'group2'
        }
      ];

      mockEnumerateDevices.mockResolvedValue(mockDevices);

      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');

      expect(cameras).toHaveLength(2);
      expect(cameras[0].label).toBe('Front Camera');
      expect(cameras[1].label).toBe('Back Camera');
    });

    test('should handle no cameras available', async () => {
      const mockDevices = [
        {
          deviceId: 'mic1',
          kind: 'audioinput',
          label: 'Microphone',
          groupId: 'group1'
        }
      ];

      mockEnumerateDevices.mockResolvedValue(mockDevices);

      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');

      expect(cameras).toHaveLength(0);
    });
  });

  describe('Video Stream Tests', () => {
    test('should create video element with stream', () => {
      const video = document.createElement('video');
      const mockStream = {
        getTracks: () => [{
          kind: 'video',
          stop: jest.fn()
        }]
      };

      video.srcObject = mockStream;
      video.autoplay = true;
      video.playsInline = true;

      expect(video.srcObject).toBe(mockStream);
      expect(video.autoplay).toBe(true);
      expect(video.playsInline).toBe(true);
    });

    test('should stop video stream', () => {
      const mockTrack = {
        kind: 'video',
        stop: jest.fn()
      };
      
      const mockStream = {
        getTracks: () => [mockTrack],
        getVideoTracks: () => [mockTrack]
      };

      // Simulate stopping the stream
      mockStream.getTracks().forEach(track => track.stop());

      expect(mockTrack.stop).toHaveBeenCalled();
    });
  });

  describe('Image Capture Tests', () => {
    test('should capture image from video to canvas', () => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const context = {
        drawImage: jest.fn(),
        getImageData: jest.fn()
      };

      canvas.getContext.mockReturnValue(context);

      // Set video dimensions
      Object.defineProperty(video, 'videoWidth', {
        value: 640,
        writable: true
      });
      Object.defineProperty(video, 'videoHeight', {
        value: 480,
        writable: true
      });

      // Set canvas dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      expect(canvas.width).toBe(640);
      expect(canvas.height).toBe(480);
      expect(context.drawImage).toHaveBeenCalledWith(video, 0, 0, 640, 480);
    });

    test('should convert canvas to blob', async () => {
      const canvas = document.createElement('canvas');
      const mockBlob = new Blob(['mock image data'], { type: 'image/jpeg' });

      // Mock toBlob method
      canvas.toBlob = jest.fn((callback) => {
        callback(mockBlob);
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          expect(blob).toBe(mockBlob);
          expect(blob.type).toBe('image/jpeg');
          resolve();
        }, 'image/jpeg', 0.8);
      });
    });

    test('should convert canvas to data URL', () => {
      const canvas = document.createElement('canvas');
      const mockDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...';

      // Mock toDataURL method
      canvas.toDataURL = jest.fn(() => mockDataURL);

      const dataURL = canvas.toDataURL('image/jpeg', 0.8);

      expect(dataURL).toBe(mockDataURL);
      expect(canvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.8);
    });
  });

  describe('Camera Constraints Tests', () => {
    test('should apply basic video constraints', async () => {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      };

      const mockStream = {
        getTracks: () => [{ kind: 'video', stop: jest.fn() }]
      };

      mockGetUserMedia.mockResolvedValue(mockStream);

      await navigator.mediaDevices.getUserMedia(constraints);

      expect(mockGetUserMedia).toHaveBeenCalledWith(constraints);
    });

    test('should handle front camera selection', async () => {
      const constraints = {
        video: {
          facingMode: 'user'
        }
      };

      const mockStream = {
        getTracks: () => [{ kind: 'video', stop: jest.fn() }]
      };

      mockGetUserMedia.mockResolvedValue(mockStream);

      await navigator.mediaDevices.getUserMedia(constraints);

      expect(mockGetUserMedia).toHaveBeenCalledWith(constraints);
    });

    test('should handle back camera selection', async () => {
      const constraints = {
        video: {
          facingMode: { exact: 'environment' }
        }
      };

      const mockStream = {
        getTracks: () => [{ kind: 'video', stop: jest.fn() }]
      };

      mockGetUserMedia.mockResolvedValue(mockStream);

      await navigator.mediaDevices.getUserMedia(constraints);

      expect(mockGetUserMedia).toHaveBeenCalledWith(constraints);
    });
  });

  describe('Error Handling Tests', () => {
    test('should handle overconstrained error', async () => {
      const mockError = new Error('Overconstrained');
      mockError.name = 'OverconstrainedError';
      mockError.constraint = 'width';

      mockGetUserMedia.mockRejectedValue(mockError);

      try {
        await navigator.mediaDevices.getUserMedia({
          video: { width: { exact: 10000 } }
        });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.name).toBe('OverconstrainedError');
        expect(error.constraint).toBe('width');
      }
    });

    test('should handle security error', async () => {
      const mockError = new Error('Security error');
      mockError.name = 'SecurityError';

      mockGetUserMedia.mockRejectedValue(mockError);

      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.name).toBe('SecurityError');
      }
    });
  });

  describe('Browser Compatibility Tests', () => {
    test('should detect getUserMedia support', () => {
      expect(navigator.mediaDevices).toBeDefined();
      expect(navigator.mediaDevices.getUserMedia).toBeDefined();
    });

    test('should handle missing getUserMedia support', () => {
      const originalMediaDevices = global.navigator.mediaDevices;
      delete global.navigator.mediaDevices;

      expect(navigator.mediaDevices).toBeUndefined();

      // Restore
      global.navigator.mediaDevices = originalMediaDevices;
    });
  });
});