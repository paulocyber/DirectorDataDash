/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/davsummaryreport",
      },
      {
        source: "/api/:path*", // Configura a rota do proxy para o backend HTTP
        destination: "http://200.233.186.22:3000/api/:path*", // Especifica o destino do backend
      },
    ];
  },
};

export default nextConfig;
