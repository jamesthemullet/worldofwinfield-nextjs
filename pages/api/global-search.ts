import type { NextApiRequest, NextApiResponse } from 'next';
import { searchBlogPosts } from '../../lib/api';
import { searchableSheets } from '../../lib/search-sheets';
import { fetchDataFromGoogleSheets } from '../../lib/sheets';
import type { GlobalSearchItem, GlobalSearchResults } from '../../lib/types';

const searchSheet = async (
  sheet: (typeof searchableSheets)[number],
  searchTerm: string,
): Promise<GlobalSearchItem[]> => {
  const rows = await fetchDataFromGoogleSheets(sheet.sheetId);
  if (!rows || rows.length < 2) return [];

  const headerRow = rows[0];
  const titleIndex = headerRow.indexOf(sheet.titleColumn);
  const subtitleIndex = sheet.subtitleColumn ? headerRow.indexOf(sheet.subtitleColumn) : -1;
  const lowerQuery = searchTerm.trim().toLowerCase();

  return rows
    .slice(1)
    .filter((row) => row.some((cell) => (cell ?? '').toString().toLowerCase().includes(lowerQuery)))
    .map((row) => ({
      title: (titleIndex !== -1 ? row[titleIndex] : row[0]) || '(untitled)',
      subtitle: subtitleIndex !== -1 ? row[subtitleIndex] : undefined,
      url: sheet.path,
    }));
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });
  const rawQ = req.query.q;
  const searchTerm = (Array.isArray(rawQ) ? rawQ[0] : rawQ) ?? '';

  const [posts, ...sheetResults] = await Promise.all([
    searchBlogPosts(searchTerm),
    ...searchableSheets.map((sheet) => searchSheet(sheet, searchTerm)),
  ]);

  const results: GlobalSearchResults = { posts };
  searchableSheets.forEach((sheet, index) => {
    const items = sheetResults[index];
    if (items.length > 0) results[sheet.key] = items;
  });

  res.status(200).json(results);
}
