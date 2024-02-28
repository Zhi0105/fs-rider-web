/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_URL: process.env.API_URL,
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
