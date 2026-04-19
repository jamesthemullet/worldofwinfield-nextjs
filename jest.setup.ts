import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListenerListener: jest.fn(),
    removeEventListener: jest.fn(),
    addEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
