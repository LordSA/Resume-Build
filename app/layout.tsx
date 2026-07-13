import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

const playfairDisplayHeading = Playfair_Display({ subsets: ['latin'], variable: '--font-heading' });

const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Resume Solutions | Professional ATS Resume Builder",
    template: "%s | Resume Solutions",
  },
  description: "Build clean, professional, and ATS-compatible resumes instantly. Drag and drop sections, choose color schemes, customize fonts, and print to PDF.",
  keywords: ["resume builder", "ATS resume", "resume solutions", "cv builder", "professional cv", "pdf resume", "resume creator"],
  authors: [{ name: "Shibili Aman TK", url: "https://github.com/LordSA" }],
  creator: "Shibili Aman TK",
  publisher: "Resume Solutions",
  metadataBase: new URL("https://resumesolutions.shibili.tech"),
  openGraph: {
    title: "Resume Solutions | Professional ATS Resume Builder",
    description: "Build clean, professional, and ATS-compatible resumes instantly.",
    url: "https://resumesolutions.shibili.tech",
    siteName: "Resume Solutions",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Resume Solutions - ATS Resume Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Solutions | ATS Resume Builder",
    description: "Build clean, professional, and ATS-compatible resumes instantly.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased", geistSans.variable, geistMono.variable, "font-sans", notoSans.variable, playfairDisplayHeading.variable)}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#18181b', // zinc-900 to match your theme
              color: '#fff',
              border: '1px solid #27272a', // zinc-800
            }
          }}
        />
      </body>
    </html>
  );
}
