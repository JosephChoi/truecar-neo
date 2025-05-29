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
    // Firebase 환경변수들은 NEXT_PUBLIC_ 접두사로 자동 노출되므로 여기서 설정할 필요 없음
  },
}

module.exports = nextConfig 