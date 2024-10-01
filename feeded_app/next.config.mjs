/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals.push({
          'firebase-admin': 'commonjs firebase-admin',
          '@opentelemetry/api': 'commonjs @opentelemetry/api',
        });
      }
      return config;
    },
  };
  
  export default nextConfig;