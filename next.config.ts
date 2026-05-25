import withPWA from '@ducanh2912/next-pwa';

const nextConfig = withPWA({
  dest: 'public',
  disable: false,
  register: true,
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
})({
  // any other next config
  reactCompiler: true,
});

export default nextConfig;
