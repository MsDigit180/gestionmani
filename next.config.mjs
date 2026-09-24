import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts", // chemin vers votre Service Worker (ou src/app/sw.ts)
  swDest: "public/sw.js",
 disable: process.env.NODE_ENV !== "production",});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
};

export default withSerwist(nextConfig);