import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8000/api/:path*',  // Django backend
      },
    ];
  },
  // Optional: Enable HTTPS for local dev (useful when cookies require secure transport)
  devIndicators: {
    autoPrerender: false,
  },
};

export default nextConfig;
