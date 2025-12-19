/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // SEO Optimizations
  compress: true, // Active la compression gzip
  poweredByHeader: false, // Cache le header X-Powered-By
  trailingSlash: false, // URLs sans / final
  
  // Headers SEO, sécurité et CORS - Configuration permissive
  async headers() {
    return [
      {
        // CORS GLOBAL - Toutes les API (laissez-passer maximum)
        source: '/api/:path*',
        headers: [
          // Autoriser TOUTES les origines
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          // Autoriser TOUTES les méthodes HTTP
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
          },
          // Autoriser TOUS les headers courants
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization, Origin, Cache-Control, Pragma, Expires, X-Api-Key, X-CSRF-Token, X-Auth-Token, stripe-signature, x-supabase-auth, apikey, x-client-info',
          },
          // Exposer les headers de réponse
          {
            key: 'Access-Control-Expose-Headers',
            value: 'Content-Length, Content-Range, X-Content-Range, X-Total-Count',
          },
          // Autoriser les credentials (cookies, auth)
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          // Durée de cache pour les preflight requests (24h)
          {
            key: 'Access-Control-Max-Age',
            value: '86400',
          },
        ],
      },
      {
        // Headers pour toutes les pages
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
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Permissions Policy pour les fonctionnalités navigateur
          {
            key: 'Permissions-Policy',
            value: 'camera=*, microphone=*, geolocation=*',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
