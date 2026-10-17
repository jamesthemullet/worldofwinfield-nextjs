import '@testing-library/jest-dom';

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListenerListener: () => {},
      removeEventListener: () => {},
      addEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
