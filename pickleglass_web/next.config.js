/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Static export for Electron app
  trailingSlash: true, // Required for static export

  images: { unoptimized: true },
}

module.exports = nextConfig 