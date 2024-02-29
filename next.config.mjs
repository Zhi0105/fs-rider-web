/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_URL: process.env.API_URL,
    API_KEY: process.env.GEOCODING_API_KEY
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
