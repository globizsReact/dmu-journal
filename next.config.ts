
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
      // Add S3 bucket hostname. Replace with your actual bucket hostname.
      // e.g., 'your-bucket-name.s3.your-region.amazonaws.com'
      // Using a wildcard for the bucket name is also an option for flexibility:
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: { allowedDevOrigins: ["https://9003-firebase-studio-1750134616478.cluster-6dx7corvpngoivimwvvljgokdw.cloudworkstations.dev"] },
};

export default nextConfig;
