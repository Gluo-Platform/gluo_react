import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ['10.0.0.2'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.gluo.xyz',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
