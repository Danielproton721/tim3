/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "qrcode.somossimpay.com.br" },
      { protocol: "https", hostname: "somossimpay.com.br" }
    ]
  }
};

module.exports = nextConfig;
