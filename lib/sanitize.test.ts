import { sanitize } from './sanitize';
import DOMPurify from 'dompurify';

jest.mock('dompurify', () => ({
  __esModule: true,
  default: {
    sanitize: jest.fn((html: string) => html),
  },
}));

describe('sanitize', () => {
  beforeEach(() => {
    (DOMPurify.sanitize as jest.Mock).mockClear();
  });

  it('delegates to DOMPurify.sanitize and returns its output', () => {
    (DOMPurify.sanitize as jest.Mock).mockReturnValueOnce('clean html');
    const result = sanitize('<b>input</b>');
    expect(DOMPurify.sanitize).toHaveBeenCalledWith('<b>input</b>', undefined);
    expect(result).toBe('clean html');
  });

  it('forwards an optional config object to DOMPurify.sanitize', () => {
    const config = { ALLOWED_TAGS: ['b'] };
    sanitize('<b>bold</b>', config);
    expect(DOMPurify.sanitize).toHaveBeenCalledWith('<b>bold</b>', config);
  });
});
