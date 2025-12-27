/** @type {import('next').NextConfig} */

// Domaines autorisés pour CORS en production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? 'https://faireuneminiature.fr, https://www.faireuneminiature.fr'
  : '*';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'nouvdwzhuicfthamuloi.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      // Google profile pictures
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      // Autres CDN courants
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // SEO Optimizations
  compress: true, // Active la compression gzip
  poweredByHeader: false, // Cache le header X-Powered-By
  trailingSlash: false, // URLs sans / final
  
  // Headers SEO, sécurité et CORS
  async headers() {
    return [
      {
        // CORS pour les API
        source: '/api/:path*',
        headers: [
          // ✅ SÉCURITÉ: Restreindre CORS en production
          {
            key: 'Access-Control-Allow-Origin',
            value: allowedOrigins,
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization, Origin, Cache-Control, Pragma, Expires, X-Api-Key, X-CSRF-Token, X-Auth-Token, stripe-signature, x-supabase-auth, apikey, x-client-info',
          },
          {
            key: 'Access-Control-Expose-Headers',
            value: 'Content-Length, Content-Range, X-Content-Range, X-Total-Count',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
        ],
      },
      {
        // Headers de sécurité pour toutes les pages
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // ✅ SÉCURITÉ: Permissions Policy restrictive
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // ✅ SÉCURITÉ: Content Security Policy (légèrement permissif pour éviter les blocages)
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://va.vercel-scripts.com https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://accounts.google.com; img-src 'self' data: https: blob: http://localhost:*; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://generativelanguage.googleapis.com https://va.vercel-scripts.com https://accounts.google.com https://www.googleapis.com; frame-src https://js.stripe.com https://hooks.stripe.com https://accounts.google.com; object-src 'none'; base-uri 'self';",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
