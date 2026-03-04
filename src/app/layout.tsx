import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeddingCard.vn – Tạo Thiệp Cưới Online Đẹp & Miễn Phí",
  description:
    "Nền tảng tạo website thiệp cưới online đẹp, miễn phí, dễ dùng. Tùy chỉnh mẫu thiệp, quản lý khách mời RSVP, chia sẻ link ngay cho bạn bè và gia đình.",
  keywords: "thiệp cưới online, website đám cưới, thiệp cưới đẹp, RSVP, quản lý khách mời",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Cinzel:wght@400;600&family=Lato:wght@300;400;700&family=Raleway:wght@300;400;500;600&family=Noto+Serif+Display:wght@400;600&family=Noto+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
