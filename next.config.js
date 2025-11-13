if (!process.env.WORDPRESS_API_URL) {
  throw new Error(`
    Please provide a valid WordPress instance URL.
    Add to your environment variables WORDPRESS_API_URL.
  `);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.WORDPRESS_API_URL.match(/(?!(w+)\.)\w*(?:\w+\.)+\w+/)[0],
      },
      { protocol: 'https', hostname: '0.gravatar.com' },
      { protocol: 'https', hostname: '1.gravatar.com' },
      { protocol: 'https', hostname: '2.gravatar.com' },
      { protocol: 'https', hostname: 'secure.gravatar.com' },
      { protocol: 'https', hostname: 'i0.wp.com' },
    ],
    qualities: [50, 75],
  },
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL,
    WORDPRESS_AUTH_REFRESH_TOKEN: process.env.WORDPRESS_AUTH_REFRESH_TOKEN,
  },
};

module.exports = nextConfig;
