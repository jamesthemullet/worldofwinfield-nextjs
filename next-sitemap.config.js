module.exports = {
  siteUrl: 'https://worldofwinfield.co.uk',
  generateSitemap: true,
  sitemapSize: 5000,
  changefreq: 'yearly',
  priority: 0.7,
  generateRobotsTxt: true,
  additionalPaths: async () => [
    {
      loc: '/',
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: '/blog',
      changefreq: 'daily',
      priority: 1.0,
    },
  ],
};
