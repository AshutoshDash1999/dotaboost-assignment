import type { Metadata } from "next";
import { Cinzel, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// Carved-stone serif for headings, close to Dota's own title lettering
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dota Stats",
  description: "Dota 2 player rankings and match stats, powered by OpenDota",
};

const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The theme script below adds the `dark` class before hydration
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        cinzel.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <head>
        <script
          // Apply the saved theme before first paint to avoid a light flash
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static inline script
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </QueryProvider>
      </body>
    </html>
  );
}
