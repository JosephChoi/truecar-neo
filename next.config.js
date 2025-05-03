/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001']
    },
  },
  eslint: {
    // Warning: 프로덕션 환경에서는 나중에 다시 활성화하는 것이 좋습니다
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: 프로덕션 환경에서는 나중에 다시 활성화하는 것이 좋습니다
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

module.exports = nextConfig 