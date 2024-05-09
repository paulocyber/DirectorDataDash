/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/davsummaryreport",
      },
    ];
  },
};

export default nextConfig;
