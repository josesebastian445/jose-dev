const { withPayload } = require('@payloadcms/next/withPayload')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Cloudflare compatible
  output: "standalone"
};

module.exports = withPayload(nextConfig);
