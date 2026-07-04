import { fetchDataFromGoogleSheets } from './sheets';

const SHEET_ID = 'test-sheet-123';
const API_KEY = 'test-api-key';

const mockFetch = jest.fn();

beforeEach(() => {
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY = API_KEY;
  mockFetch.mockReset();
  global.fetch = mockFetch as unknown as typeof fetch;
});

describe('fetchDataFromGoogleSheets', () => {
  it('returns the values array from a successful response', async () => {
    const mockValues = [
      ['Header1', 'Header2'],
      ['Row1Col1', 'Row1Col2'],
    ];
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ values: mockValues }),
    });

    const result = await fetchDataFromGoogleSheets(SHEET_ID);

    expect(result).toEqual(mockValues);
  });

  it('constructs the correct URL using the sheet ID and API key', async () => {
    mockFetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ values: [] }),
    });

    await fetchDataFromGoogleSheets(SHEET_ID);

    const expectedUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?alt=json&key=${API_KEY}`;
    expect(mockFetch).toHaveBeenCalledWith(expectedUrl);
  });

  it('returns null and logs an error when fetch throws', async () => {
    mockFetch.mockRejectedValue(new Error('Network failure'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = await fetchDataFromGoogleSheets(SHEET_ID);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
