/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ["http://127.0.0.1"],
        remotePatterns: [
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "5000",
                pathname: "/**",
            },
        ],
    },
};

module.exports = nextConfig;
