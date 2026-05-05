"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/financial", label: "Financial" },
  { href: "/marketing", label: "Marketing" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header style={{ background: "var(--card)", borderBottom: "1px solid var(--card-border)" }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Brand wordmark */}
        <div className="flex items-center gap-1">
          <span className="font-bold text-xl tracking-tight" style={{ color: "var(--foreground)" }}>
            FOUR HOUR
          </span>
          <span className="font-bold text-xl tracking-widest" style={{ color: "var(--accent)" }}>
            FREEDOM
          </span>

          <span
            className="text-xs px-2 py-0.5 rounded-full ml-2"
            style={{ background: "var(--background)", color: "var(--muted)", border: "1px solid var(--card-border)" }}
          >
            Reports
          </span>
        </div>

        <nav className="flex gap-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={{
                  background: active ? "var(--accent)" : "transparent",
                  color: active ? "#ffffff" : "var(--muted)",
                  fontWeight: active ? 700 : 500,
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
