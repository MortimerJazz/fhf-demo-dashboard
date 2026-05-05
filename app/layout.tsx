import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Four Hour Freedom — Dashboard",
  description: "Business intelligence dashboard for Four Hour Freedom",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: "var(--background)", color: "var(--foreground)" }}>
        <Nav />
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
          {children}
        </main>
        <footer className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between" style={{ borderTop: "1px solid var(--card-border)" }}>
          <span className="text-xs" style={{ color: "var(--muted)" }}>Four Hour Freedom · Demo Dashboard · Data shown is illustrative only</span>
          <a
            href="http://fourhourfreedom.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold"
            style={{ color: "var(--accent)" }}
          >
            Subscribe to the newsletter ↗
          </a>
        </footer>
      </body>
    </html>
  );
}
