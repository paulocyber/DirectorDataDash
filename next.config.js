/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Permite que o build continue mesmo com warnings do ESLint
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Permite que o build continue mesmo com erros de tipo (não recomendado em produção)
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
