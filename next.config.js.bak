/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin')(
  './src/i18n.ts'
);

// Activar export estático en GitHub Actions o Cloud Build
const isStaticExport = process.env.GITHUB_ACTIONS === 'true' || process.env.STATIC_EXPORT === 'true' || process.env.DOCKER === 'true' || process.env.NODE_ENV === 'production';
// Si hay un dominio personalizado configurado, no usar basePath
// CUSTOM_DOMAIN viene del workflow como 'true' o 'false' (string)
const hasCustomDomain = process.env.CUSTOM_DOMAIN === 'true' || process.env.CNAME_DOMAIN === 'true';

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Activar export estático en GitHub Actions o Cloud Build
  ...(isStaticExport ? {
    output: 'export',
    // Sin basePath para dominio personalizado en GCP
    basePath: '',
    assetPrefix: '',
    trailingSlash: true,
    // Deshabilitar middleware durante build estático si causa problemas
    // El middleware solo se ejecutará en runtime con servidor Node.js
  } : {}),
  webpack: (config, { isServer }) => {
    // Mejorar el manejo de módulos para evitar problemas con vendor chunks
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    // Asegurar que tailwind-merge se resuelva correctamente
    try {
      config.resolve.alias = {
        ...config.resolve.alias,
        'tailwind-merge': require.resolve('tailwind-merge'),
      };
    } catch (error) {
      // Si no se puede resolver, continuar sin el alias
      // Could not resolve tailwind-merge alias - non-critical, continue without it
    }
    
    return config;
  },
  images: {
    unoptimized: isStaticExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'asset.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'applications-media.feverup.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.feverup.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'feverup.com',
        port: '',
        pathname: '/**',
      }
    ],
  }
};

module.exports = createNextIntlPlugin(nextConfig);

