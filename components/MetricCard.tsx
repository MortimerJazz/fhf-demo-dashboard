interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  alert?: boolean;
  large?: boolean;
}

export default function MetricCard({ label, value, sub, trend, alert, large }: MetricCardProps) {
  const trendColor =
    trend === "up" ? "var(--accent)" :
    trend === "down" ? "var(--accent-red)" :
    "var(--foreground)";

  return (
    <div
      className={`rounded-xl flex flex-col gap-1 ${large ? "p-7" : "p-5"}`}
      style={{
        background: "var(--card)",
        border: alert ? "1px solid var(--accent-red)" : "1px solid var(--card-border)",
      }}
    >
      <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
        {label}
      </span>
      <span
        className={`font-bold ${large ? "text-4xl" : "text-2xl"}`}
        style={{ color: trendColor }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          {sub}
        </span>
      )}
    </div>
  );
}
