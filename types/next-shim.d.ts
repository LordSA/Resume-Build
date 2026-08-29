declare module "next" {
  export interface Metadata {
    title?: any;
    description?: string;
    keywords?: string[];
    authors?: any[];
    creator?: string;
    publisher?: string;
    robots?: any;
    openGraph?: any;
    twitter?: any;
    icons?: any;
    metadataBase?: URL;
  }
  export type NextConfig = Record<string, any>;
  export namespace MetadataRoute {
    export type Robots = {
      rules: {
        userAgent?: string | string[];
        allow?: string | string[];
        disallow?: string | string[];
      } | Array<{
        userAgent?: string | string[];
        allow?: string | string[];
        disallow?: string | string[];
      }>;
      sitemap?: string | string[];
      host?: string;
    };
    export type Sitemap = Array<{
      url: string;
      lastModified?: string | Date;
      changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
      priority?: number;
    }>;
  }
}

declare module "next/server" {
  export class NextRequest extends Request {
    nextUrl: URL & { clone: () => URL };
    cookies: any;
    ip?: string;
    geo?: any;
  }
  export class NextResponse extends Response {
    static json(body: any, init?: ResponseInit): NextResponse;
    static redirect(url: string | URL, init?: number | ResponseInit): NextResponse;
    static next(options?: any): NextResponse;
    cookies: any;
  }
}

declare module "next/headers" {
  export function cookies(): Promise<any>;
  export function headers(): Promise<any>;
}

declare module "next/navigation" {
  export function useRouter(): {
    push: (href: string) => void;
    replace: (href: string) => void;
    refresh: () => void;
    back: () => void;
    forward: () => void;
    prefetch: (href: string) => void;
  };
  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function redirect(url: string): never;
  export function notFound(): never;
}

declare module "next/link" {
  import React from "react";
  const Link: React.ComponentType<any>;
  export default Link;
}

declare module "next/font/google" {
  export function Geist(options?: any): { variable: string; className: string; style: any };
  export function Geist_Mono(options?: any): { variable: string; className: string; style: any };
  export function Noto_Sans(options?: any): { variable: string; className: string; style: any };
  export function Playfair_Display(options?: any): { variable: string; className: string; style: any };
  export function Inter(options?: any): { variable: string; className: string; style: any };
  export function Outfit(options?: any): { variable: string; className: string; style: any };
}

declare module "framer-motion" {
  export const motion: any;
  export const AnimatePresence: any;
  export function useMotionValue(initial: any): any;
  export function useTransform(...args: any[]): any;
}
