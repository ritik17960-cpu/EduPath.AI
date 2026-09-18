/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Keep `next build` from failing on stylistic lint rules (e.g. unescaped
    // apostrophes in copy). Run `npm run lint` separately if you want warnings.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
