import type { NextConfig } from "next";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "") || "";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", supabaseUrl].filter(Boolean),
  },
};

export default nextConfig;
