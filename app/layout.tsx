import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FundiGuard.ke – Book Verified Fundis with Escrow & Insurance",
  description: "Kenya's most trusted on-demand services marketplace. Book verified plumbers, electricians, cleaners, tutors & more. M-Pesa escrow, job insurance, 48hr dispute resolution.",
  keywords: "fundi, kenya, plumber nairobi, electrician nairobi, home services kenya, mpesa escrow, verified fundis",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "FundiGuard.ke – Book Verified Fundis with Insurance",
    description: "Fundi anakuja. Kazi inafanyika. Au tunarekebisha bure.",
    url: "https://fundiguard.ke",
    siteName: "FundiGuard.ke",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#00C853",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
