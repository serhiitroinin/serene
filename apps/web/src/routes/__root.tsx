/// <reference types="vite/client" />
import type { ReactNode } from "react";
import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import "../styles/globals.css";

const FONTS_URL =
  "https://fonts.googleapis.com/css2?" +
  [
    "family=JetBrains+Mono:wght@400;500;600;700",
    "family=IBM+Plex+Mono:wght@300;400;500;600",
    "family=Manrope:wght@200..800",
    "family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700",
    "family=Bricolage+Grotesque:opsz,wght@12..96,200..800",
    "display=swap",
  ].join("&");

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "serene" },
      {
        name: "description",
        content: "A designer-grade open-source dashboard for athletes with Type 1 Diabetes.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: FONTS_URL },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          // Avoid theme flash: read localStorage before paint.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('serene-theme');var d=document.documentElement;if(t==='light'){d.classList.remove('dark');d.classList.add('light')}else if(t==='dark'){d.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
