import withPWA from '@ducanh2912/next-pwa';

const nextConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
})({
  // any other next config
  reactCompiler: true,
});

export default nextConfig;
