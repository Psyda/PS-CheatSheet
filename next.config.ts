import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Ignoring build errors in deployment
    ignoreBuildErrors: true,
  },
    output: 'export'
}

module.exports = nextConfig