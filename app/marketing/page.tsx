"use client";

export default function MarketingDashboard() {
  return (
    <div className="flex flex-col gap-8">

      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketing Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Newsletter · LinkedIn · Substack Notes
          </p>
        </div>
      </div>

      {/* Placeholder state */}
      <div
        className="rounded-xl p-10 flex flex-col items-center justify-center gap-4 text-center"
        style={{ background: "var(--card)", border: "2px dashed var(--card-border)" }}
      >
        <div className="text-4xl">📊</div>
        <h2 className="text-lg font-semibold">Marketing data coming soon</h2>
        <p className="text-sm max-w-md" style={{ color: "var(--muted)" }}>
          This dashboard will display your Substack subscriber growth, open rates,
          LinkedIn post performance, and Substack Notes engagement.
        </p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Export your <strong style={{ color: "var(--foreground)" }}>Substack subscriber CSV</strong> and{" "}
          <strong style={{ color: "var(--foreground)" }}>LinkedIn analytics export</strong> to populate this dashboard.
        </p>
      </div>

      {/* Skeleton cards to show the shape of things */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>
          Newsletter (Substack)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Total Subscribers", "New This Month", "Open Rate", "Best Performing Issue"].map((label) => (
            <div
              key={label}
              className="rounded-xl p-5"
              style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
            >
              <span className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: "var(--muted)" }}>
                {label}
              </span>
              <div className="h-7 w-24 rounded" style={{ background: "#2d3148" }} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>
          LinkedIn
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Impressions (MTD)", "Engagement Rate", "Posts Published", "Top Post Reach"].map((label) => (
            <div
              key={label}
              className="rounded-xl p-5"
              style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
            >
              <span className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: "var(--muted)" }}>
                {label}
              </span>
              <div className="h-7 w-24 rounded" style={{ background: "#2d3148" }} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
