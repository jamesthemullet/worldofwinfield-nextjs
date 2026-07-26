import type { NextApiRequest, NextApiResponse } from 'next';
import { searchBlogPosts } from '../../lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });
  const rawQ = req.query.q;
  const searchTerm = (Array.isArray(rawQ) ? rawQ[0] : rawQ) ?? '';
  const posts = await searchBlogPosts(searchTerm);
  res.status(200).json(posts);
}
