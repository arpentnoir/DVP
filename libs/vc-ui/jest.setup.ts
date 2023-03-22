import 'jest-canvas-mock';
import '@testing-library/jest-dom';

const mockClipboard = {
  writeText: jest.fn(),
};

(global.navigator.clipboard as any) = mockClipboard;
