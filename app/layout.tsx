import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#2563eb',
}

export const metadata: Metadata = {
  title: "트루카 - 주문형 중고차 서비스",
  description: "중고차를 사는 새로운 방법, 트루카 주문형 중고차 서비스. 20년 경력의 전문가가 맞춤형 중고차를 찾아드립니다.",
  keywords: "중고차, 주문형 중고차, 트루카, 중고차 구매, 맞춤형 차량 검색",
  authors: [{ name: "TrueCar" }],
  robots: "index, follow",
  icons: {
    icon: "/images/favicon.svg",
  },
  openGraph: {
    title: "트루카 - 주문형 중고차 서비스",
    description: "중고차를 사는 새로운 방법, 트루카 주문형 중고차 서비스",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
