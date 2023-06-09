/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/app-build-manifest.json$/],
});

module.exports = withPWA({
  images: {
    domains: ["cloud.appwrite.io"],
  },
});
