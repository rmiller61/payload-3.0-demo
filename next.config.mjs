import { withPayload } from '@payloadcms/next/withPayload'
import "./src/env.mjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
}

export default withPayload(nextConfig)
