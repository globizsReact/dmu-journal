
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      { // Keep placehold.co for article list items or other placeholders
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // CloudFront distribution for S3 bucket
      {
        protocol: 'https',
        hostname: 'diuu569ds96wh.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      // Direct S3 bucket URL (for legacy data or direct access)
      {
        protocol: 'https',
        hostname: 'dmu-journals.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: { allowedDevOrigins: ["https://9003-firebase-studio-1750134616478.cluster-6dx7corvpngoivimwvvljgokdw.cloudworkstations.dev"] },
};

export default nextConfig;
