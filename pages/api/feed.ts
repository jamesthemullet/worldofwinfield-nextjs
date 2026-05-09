import { NextApiRequest, NextApiResponse } from 'next';
import { getAllPostsForHome } from '../../lib/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await getAllPostsForHome(false);
  const posts = data.edges.map(({ node }: { node: Record<string, unknown> }) => node);

  const siteUrl = 'https://www.worldofwinfield.com';

  const items = posts
    .map((post: { title: string; slug: string; date: string; excerpt: string }) => {
      const excerpt = post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '').trim() : '';
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/posts/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${excerpt}]]></description>
    </item>`;
    })
    .join('');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>World Of Winfield</title>
    <link>${siteUrl}</link>
    <description>The latest posts from World Of Winfield</description>
    <language>en-gb</language>
    <atom:link href="${siteUrl}/api/feed" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.status(200).send(feed);
}
