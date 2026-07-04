import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllPostsForHome } from '../../lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });
  const after = (req.query.after as string) || null;
  const posts = await getAllPostsForHome(false, after);
  res.status(200).json(posts);
}
