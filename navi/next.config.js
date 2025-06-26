/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'upload.wikimedia.org'],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig; 