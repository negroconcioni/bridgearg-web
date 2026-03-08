/**
 * Next.js config para cuando migres este proyecto a Next.js.
 * 
 * IMPORTANTE:
 * - Reemplaza "YOUR_PROJECT_REF.supabase.co" por el hostname real de tu proyecto Supabase,
 *   por ejemplo: "abcd1234.supabase.co".
 * - Este archivo no afecta a tu build actual con Vite; solo tendrá efecto en un proyecto Next.js.
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

