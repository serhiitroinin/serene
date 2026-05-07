/// <reference types="vite/client" />
import type { ReactNode } from "react";
import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import "../styles/globals.css";

const FONTS_URL =
  "https://fonts.googleapis.com/css2?" +
  [
    "family=JetBrains+Mono:wght@300;400;500;700",
    "family=IBM+Plex+Mono:wght@300;400;500;600;700",
    "family=Archivo+Black",
    "family=Bebas+Neue",
    "family=Anton",
    "family=Manrope:wght@200..800",
    "family=Playfair+Display:ital,wght@0,400..900;1,400..900",
    "family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700",
    "family=VT323",
    "family=Major+Mono+Display",
    "family=Special+Elite",
    "family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900",
    "family=Caveat:wght@400..700",
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
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
