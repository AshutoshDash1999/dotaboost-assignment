import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.steamstatic.com" },
      { protocol: "https", hostname: "cdn.cloudflare.steamstatic.com" },
      {
        protocol: "https",
        hostname: "www.opendota.com",
        pathname: "/assets/images/dota2/rank_icons/**",
      },
    ],
  },
};

export default nextConfig;
