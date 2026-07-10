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
      { loc: '/now', changefreq: 'weekly', priority: 0.8 },
      { loc: '/travel', changefreq: 'monthly', priority: 0.7 },
      { loc: '/goals', changefreq: 'monthly', priority: 0.7 },
      { loc: '/music', changefreq: 'monthly', priority: 0.7 },
      { loc: '/politics', changefreq: 'monthly', priority: 0.7 },
      { loc: '/stats', changefreq: 'monthly', priority: 0.6 },
      { loc: '/stocks', changefreq: 'weekly', priority: 0.6 },
      { loc: '/wants', changefreq: 'monthly', priority: 0.6 },
      { loc: '/favourites', changefreq: 'monthly', priority: 0.7 },
      { loc: '/favourite-books', changefreq: 'monthly', priority: 0.6 },
      { loc: '/favourite-beers', changefreq: 'monthly', priority: 0.6 },
      { loc: '/favourite-cheese', changefreq: 'monthly', priority: 0.6 },
      { loc: '/favourite-cities', changefreq: 'monthly', priority: 0.6 },
      { loc: '/favourite-countries', changefreq: 'monthly', priority: 0.6 },
      { loc: '/favourite-djs', changefreq: 'monthly', priority: 0.6 },
      { loc: '/favourite-movies', changefreq: 'monthly', priority: 0.6 },
      { loc: '/favourite-restaurants', changefreq: 'monthly', priority: 0.6 },
      { loc: '/favourite-tracks', changefreq: 'monthly', priority: 0.6 },
      { loc: '/favourite-articles', changefreq: 'monthly', priority: 0.6 },
      { loc: '/countries-visited', changefreq: 'monthly', priority: 0.6 },
      { loc: '/holiday-wish-list', changefreq: 'monthly', priority: 0.6 },
      { loc: '/restaurant-wish-list', changefreq: 'monthly', priority: 0.6 },
      { loc: '/tags', changefreq: 'weekly', priority: 0.7 },
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
