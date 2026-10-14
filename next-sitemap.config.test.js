describe('next-sitemap.config.js additionalPaths', () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL = originalApiUrl;
    jest.resetModules();
  });

  it('includes /archive-page, the /year-in-review index, and every /year-in-review/{year} path', async () => {
    delete process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
    const config = require('./next-sitemap.config.js');

    const paths = await config.additionalPaths();
    const locs = paths.map((path) => path.loc);

    expect(locs).toContain('/archive-page');
    expect(locs).toContain('/year-in-review');

    const currentYear = new Date().getFullYear();
    for (let year = 2018; year <= currentYear; year++) {
      expect(locs).toContain(`/year-in-review/${year}`);
    }
  });
});
