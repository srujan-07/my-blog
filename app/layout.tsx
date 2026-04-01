import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Container } from "@/components/Container";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Srujan's Terminal Blog",
  description: "A minimal, hacker-style technical blog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground font-mono flex flex-col">
        <Container>
          <Navbar />
          <main className="pb-20">
            {children}
          </main>
        </Container>
      </body>
    </html>
  );
}
