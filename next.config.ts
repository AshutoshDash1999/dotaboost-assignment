import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.steamstatic.com" },
      { protocol: "https", hostname: "cdn.cloudflare.steamstatic.com" },
      // Team logos on pro matches
      { protocol: "https", hostname: "cdn.steamusercontent.com" },
      { protocol: "https", hostname: "steamusercontent-a.akamaihd.net" },
      { protocol: "https", hostname: "steamcdn-a.akamaihd.net" },
      {
        protocol: "https",
        hostname: "www.opendota.com",
        pathname: "/assets/images/dota2/rank_icons/**",
      },
      {
        protocol: "https",
        hostname: "www.opendota.com",
        pathname: "/assets/images/dota2/map/**",
      },
    ],
  },
};

export default nextConfig;
