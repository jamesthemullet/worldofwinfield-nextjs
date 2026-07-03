import type { NextApiRequest, NextApiResponse } from 'next';
import { searchBlogPosts } from '../../lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });
  const searchTerm = (req.query.q as string) || '';
  const posts = await searchBlogPosts(searchTerm);
  res.status(200).json(posts);
}
