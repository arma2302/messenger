// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"],
  },
  experimental: {
    // @ts-ignore
    appDir: true, // Make sure this is enabled to use the app directory
  },
};

// Use CommonJS export
module.exports = nextConfig;
