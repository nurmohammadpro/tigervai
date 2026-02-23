import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler:true,
  typedRoutes: true,
  images: {
    remotePatterns: [
        
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/my-tiger-vai-bucket/**",
      },
      {
        protocol: "https",
        hostname: "multi-vendor-minio.pixs1x.easypanel.host",
        port: "9000",
        pathname: "/my-tiger-vai-bucket/**",
      },
    
    ],
    unoptimized: true,
  },
  
  experimental:{
     serverActions: {
      bodySizeLimit: '10mb',
    },
    cssChunking:true
    
    
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output:"standalone"
  
  
};

export default nextConfig;
