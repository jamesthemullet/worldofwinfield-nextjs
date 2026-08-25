import { searchableSheets } from './search-sheets';

describe('searchableSheets', () => {
  it('has unique keys across all entries', () => {
    const keys = searchableSheets.map((s) => s.key);
    const uniqueKeys = new Set(keys);

    expect(uniqueKeys.size).toBe(keys.length);
  });

  it('every entry has a non-empty sheetId, path, and titleColumn', () => {
    for (const sheet of searchableSheets) {
      expect(sheet.sheetId).toBeTruthy();
      expect(sheet.path).toMatch(/^\//);
      expect(sheet.titleColumn).toBeTruthy();
    }
  });
});
