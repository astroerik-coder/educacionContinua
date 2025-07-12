/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // experimental: {
  //   esmExternals: 'loose',
  // },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        path: false,
        os: false,
      };
    }
    
    // Add this to prevent scanning system directories
    config.snapshot = {
      ...(config.snapshot || {}),
      // Add only the directories you want to scan
      managedPaths: [
        /^(.+?[\\/]node_modules[\\/])/,
      ],
      // Or completely ignore certain paths
      immutablePaths: [
        'C:\\Users\\',
        'C:\\Windows\\',
        'C:\\Program Files\\',
        'C:\\Program Files (x86)\\',
        'C:\\ProgramData\\',
      ],
    };
    
    // Restrict module resolution
    config.resolve.modules = [
      'node_modules',
      '.',
    ];
    
    // Set the context to avoid scanning system directories
    config.context = process.cwd();
    
    return config;
  },
}

export default nextConfig;