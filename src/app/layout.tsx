import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABH Plaza Property Management System",
  description: "Professional property management for ABH Plaza",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any", type: "image/png" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
