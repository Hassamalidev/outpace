/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Workspace packages ship TypeScript source and are compiled by Next.
  transpilePackages: ['@forge/types'],
  // Linting runs as its own turbo task (`pnpm lint`).
  eslint: { ignoreDuringBuilds: true },
}

export default nextConfig
