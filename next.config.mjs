/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.trustmenclinic.com', 'maindoagency.pythonanywhere.com', '127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
