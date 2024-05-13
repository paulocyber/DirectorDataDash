/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  server: {
    protocol: "http",
  },
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
