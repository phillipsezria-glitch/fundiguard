declare module "next-pwa" {
  import { NextConfig } from "next";
  
  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    [key: string]: unknown;
  }

  type WithPWA = (config: PWAConfig) => (nextConfig: NextConfig) => NextConfig;
  
  const withPWA: WithPWA;
  export = withPWA;
}
