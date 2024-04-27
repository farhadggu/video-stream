import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const figtree = Figtree({
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body className="bg-[#000000] text-white">
        {children}
      </body>
    </html>
  );
}