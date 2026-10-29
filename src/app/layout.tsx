import type { Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Runs before first paint so a saved theme applies with no flash. Without one, CSS follows the system.
const themeScript = `try{var t=localStorage.getItem("site-theme");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`;

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--site-font-inter",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body id="top">{children}</body>
    </html>
  );
}
