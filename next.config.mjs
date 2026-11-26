/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      { source: "/about", destination: "/" },
      { source: "/stack", destination: "/" },
      { source: "/experience", destination: "/" },
      { source: "/projects", destination: "/" },
      { source: "/contact", destination: "/" },
    ]
  },
}

export default nextConfig