/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable to avoid double mounting issues
  // Suppress hydration warnings for custom elements
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config, { isServer }) => {
    // Don't bundle React for the widget - let it use CDN React
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // This might help, but we're loading from CDN anyway
      }
    }
    return config
  },
}

module.exports = nextConfig

