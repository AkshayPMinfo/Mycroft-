import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mycroft PM",
  description: "AI-native Product Management Operating System MVP"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
