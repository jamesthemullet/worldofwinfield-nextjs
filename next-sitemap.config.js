async function fetchAllPostSlugs(apiUrl) {
  const allPosts = [];
  let hasNextPage = true;
  let afterCursor = null;

  while (hasNextPage) {
    const query = `
      query {
        posts(first: 100${afterCursor ? `, after: "${afterCursor}"` : ''}, where: { orderby: { field: DATE, order: DESC } }) {
          edges {
            node {
              slug
              modified
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    const json = await res.json();
    const posts = json.data?.posts;

    if (!posts) break;

    posts.edges.forEach(({ node }) => allPosts.push(node));
    hasNextPage = posts.pageInfo.hasNextPage;
    afterCursor = posts.pageInfo.endCursor;
  }

  return allPosts;
}

module.exports = {
  siteUrl: 'https://worldofwinfield.co.uk',
  generateSitemap: true,
  sitemapSize: 5000,
  changefreq: 'yearly',
  priority: 0.7,
  generateRobotsTxt: true,
  exclude: ['/*'],
  additionalPaths: async () => {
    const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

    const staticPaths = [
      { loc: '/', changefreq: 'daily', priority: 1.0 },
      { loc: '/blog', changefreq: 'daily', priority: 1.0 },
    ];

    if (!apiUrl) {
      console.warn('next-sitemap: NEXT_PUBLIC_WORDPRESS_API_URL not set, skipping post slugs');
      return staticPaths;
    }

    const posts = await fetchAllPostSlugs(apiUrl);

    const postPaths = posts.map((node) => ({
      loc: `/${node.slug}`,
      changefreq: 'monthly',
      priority: 0.8,
      lastmod: node.modified || undefined,
    }));

    return [...staticPaths, ...postPaths];
  },
};
