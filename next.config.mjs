/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DEV_URL: process.env.API_URL,
    FS_URL: process.env.API_URL_FS,
    TH_URL: process.env.API_URL_TH,
    VN_URL: process.env.API_URL_VN,
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
