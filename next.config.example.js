/**
 * Example Next.js config for when you migrate to Next.js.
 * Copy to next.config.js and set hostname to your Supabase project (e.g. "abcdefgh.supabase.co").
 * This allows next/image to load images from your Supabase storage bucket.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "YOUR_PROJECT_REF.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

module.exports = nextConfig;
