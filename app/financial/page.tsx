"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine,
} from "recharts";
import MetricCard from "@/components/MetricCard";
import { financialYears, currentYTD, balanceSheetData, recentTransactions, taxPots, outstandingInvoices, proposals, type MonthPayment, type ProposalStage } from "@/lib/data";

const COLORS = ["#d2782d","#3c6978","#e8a045","#5a8fa0","#c45f1e","#7ba8b8","#f0b870","#2d5566","#e89a60","#1a3f50","#a0c8d8","#b06020"]

const FULL_MONTH: Record<string, string> = {
  Apr: "April", May: "May", Jun: "June", Jul: "July", Aug: "August",
  Sep: "September", Oct: "October", Nov: "November", Dec: "December",
  Jan: "January", Feb: "February", Mar: "March",
};

const fmt = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(v);

const fmtExact = (v: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

const pct = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

interface TooltipEntry { name: string; value: number; color: string }
interface TooltipProps { active?: boolean; payload?: TooltipEntry[]; label?: string }

type ExpandedBar = { month: string; breakdown: MonthPayment[] } | null

function BreakdownPanel({ expanded, onClose }: { expanded: ExpandedBar; onClose: () => void }) {
  if (!expanded) return null;
  const total = expanded.breakdown.reduce((s, p) => s + p.amount, 0);
  return (
    <div className="mt-4 rounded-lg p-4" style={{ background: "var(--background)", border: "1px solid var(--card-border)" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          {FULL_MONTH[expanded.month]} — Revenue Breakdown
        </p>
        <button
          onClick={onClose}
          className="text-xs px-2 py-0.5 rounded"
          style={{ color: "var(--muted)", background: "var(--card-border)" }}
        >
          Close
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {expanded.breakdown.map((p, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="text-xs px-1.5 py-0.5 rounded flex-shrink-0"
                style={{ background: p.brand === "Four Hour Freedom" ? "#3c6978" : "var(--accent)", color: "#fff", opacity: 0.9 }}
              >
                {p.brand === "Four Hour Freedom" ? "FHF" : "CON"}
              </span>
              <span style={{ color: "var(--foreground)" }}>{p.client}</span>
            </div>
            <div className="flex items-center gap-4 text-right">
              <span className="text-xs" style={{ color: "var(--muted)" }}>{((p.amount / total) * 100).toFixed(1)}%</span>
              <span className="font-semibold" style={{ color: p.brand === "Four Hour Freedom" ? "#3c6978" : "var(--accent)" }}>{fmtExact(p.amount)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 flex justify-between text-sm font-semibold" style={{ borderTop: "1px solid var(--card-border)" }}>
        <span style={{ color: "var(--muted)" }}>Total</span>
        <span style={{ color: "var(--foreground)" }}>{fmtExact(total)}</span>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3 text-sm shadow-xl" style={{ background: "#1a3f50", border: "1px solid var(--card-border)" }}>
      <p className="font-semibold mb-1" style={{ color: "var(--foreground)" }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  );
};

function daysFromToday(dateStr: string): number {
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.floor((d.getTime() - today.getTime()) / 86400000);
}

const STAGE_ORDER: ProposalStage[] = ["Discovery", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
const STAGE_COLOR: Record<ProposalStage, string> = {
  "Discovery":    "#5a8fa0",
  "Proposal":     "#d2782d",
  "Negotiation":  "#e8a045",
  "Closed Won":   "#2a7a4f",
  "Closed Lost":  "#7a2a2a",
};

const ANNUAL_GOAL = 80000;
const GOAL_MONTHS_TOTAL = 12;
const GOAL_MONTHS_ELAPSED = 1;

const YEARS = ["2025/26", "2024/25"] as const;

const TICK = { fill: "#7ba8b8", fontSize: 12 };
const GRID = "#0f2d3c";

export default function FinancialDashboard() {
  const [selectedYear, setSelectedYear] = useState<"2025/26" | "2024/25">("2025/26");
  const [currentFYExpanded, setCurrentFYExpanded] = useState<ExpandedBar>(null);
  const [priorYearExpanded, setPriorYearExpanded] = useState<ExpandedBar>(null);

  const makeBarClickHandler = (setExpanded: React.Dispatch<React.SetStateAction<ExpandedBar>>) =>
    (data: object) => {
      const { activePayload } = data as { activePayload?: Array<{ payload: { month: string; breakdown?: MonthPayment[] } }> };
      const payload = activePayload?.[0]?.payload;
      if (!payload?.breakdown?.length) return;
      setExpanded(prev =>
        prev?.month === payload.month ? null : { month: payload.month, breakdown: payload.breakdown! }
      );
    };

  const fy = financialYears[selectedYear];
  const priorKey = selectedYear === "2025/26" ? "2024/25" : null;
  const priorFy = priorKey ? financialYears[priorKey] : null;

  const totalRevenue  = fy.months.reduce((s, m) => s + m.revenue, 0);
  const totalExpenses = fy.months.reduce((s, m) => s + m.expenses, 0);
  const totalNet      = fy.months.reduce((s, m) => s + m.net, 0);
  const bestMonth     = fy.months.reduce((a, b) => (a.revenue > b.revenue ? a : b));
  const priorRevenue  = priorFy ? priorFy.months.reduce((s, m) => s + m.revenue, 0) : null;
  const revenueChange = priorRevenue ? ((totalRevenue - priorRevenue) / priorRevenue) * 100 : null;

  // FY 2026/27 (current year)
  const ytdRevenue      = currentYTD.months.reduce((s, m) => s + m.revenue, 0);
  const ytdDDRevenue    = currentYTD.months.reduce((s, m) => s + m.services + m.contentGen, 0);
  const ytdFHFRevenue   = currentYTD.months.reduce((s, m) => s + m.sales, 0);
  const ytdExpenses     = currentYTD.months.reduce((s, m) => s + m.expenses, 0);
  const ytdNet          = currentYTD.months.reduce((s, m) => s + m.net, 0);
  const ytdBestMonth    = currentYTD.months.reduce((a, b) => (a.revenue > b.revenue ? a : b));
  const ytdMonthlyAvg   = ytdRevenue / currentYTD.months.length;
  const goalProgress    = (ytdRevenue / ANNUAL_GOAL) * 100;
  const goalRemaining   = ANNUAL_GOAL - ytdRevenue;
  const monthsLeft      = GOAL_MONTHS_TOTAL - GOAL_MONTHS_ELAPSED;
  const monthlyNeeded   = goalRemaining / monthsLeft;
  const onTrackMonthly  = ANNUAL_GOAL / GOAL_MONTHS_TOTAL;

  const expenseSlices = Object.entries(fy.expenses).map(([name, value]) => ({ name, value }));

  // Client concentration
  const clientTotals = currentYTD.months
    .flatMap(m => m.breakdown)
    .reduce((acc, p) => ({ ...acc, [p.client]: (acc[p.client] ?? 0) + p.amount }), {} as Record<string, number>);
  const clientRanked = Object.entries(clientTotals).sort((a, b) => b[1] - a[1]);
  const topClient = clientRanked[0];
  const topClientPct = topClient && ytdRevenue > 0 ? (topClient[1] / ytdRevenue) * 100 : 0;
  const concentrationAlert = topClientPct > 40;

  // Tax set-aside estimates
  const estCorpTax = Math.max(0, ytdNet * 0.19);
  const corpTaxShortfall = Math.max(0, estCorpTax - taxPots.corpTax);

  // Full 12-month skeleton for FY 2026/27 (future months show zero)
  const FY_MONTHS = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
  const currentFYChartData = FY_MONTHS.map(month => {
    const actual = currentYTD.months.find(m => m.month === month);
    return {
      month,
      "Consulting": actual ? actual.services + actual.contentGen : 0,
      "Four Hour Freedom": actual?.sales ?? 0,
      hasData: !!actual,
      breakdown: actual?.breakdown ?? [],
    };
  });

  // Compare FY 2026/27 months to same months in selected prior year
  const ytdComparisonData = currentYTD.months.map(m => ({
    month: m.month,
    "FY 2026/27": m.revenue,
    [fy.label]: fy.months.find(fm => fm.month === m.month)?.revenue ?? 0,
  }));

  const priorSamePeriod = currentYTD.months.reduce((s, m) => {
    return s + (fy.months.find(fm => fm.month === m.month)?.revenue ?? 0);
  }, 0);
  const ytdRevenueChange = priorSamePeriod > 0
    ? ((ytdRevenue - priorSamePeriod) / priorSamePeriod) * 100
    : null;

  const incomeRows    = recentTransactions.filter(t => t.direction === "IN").slice(0, 5);
  const outgoingRows  = recentTransactions.filter(t => t.direction === "OUT").slice(0, 5);

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Financial Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>FY 2026/27 · Apr 2026 – Mar 2027 · UK tax year</p>
      </div>

      {/* Client concentration alert */}
      {concentrationAlert && (
        <div className="rounded-xl px-5 py-4 flex items-start gap-3" style={{ background: "#1a1200", border: "1px solid #d2782d" }}>
          <span className="text-lg mt-0.5">⚠</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#e8a045" }}>Client Concentration Risk</p>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
              <span style={{ color: "var(--foreground)", fontWeight: 600 }}>{topClient[0]}</span> accounts for{" "}
              <span style={{ color: "#e8a045", fontWeight: 600 }}>{topClientPct.toFixed(1)}%</span> of YTD revenue ({fmtExact(topClient[1])}).
              Consider diversifying to reduce reliance on a single client.
            </p>
          </div>
        </div>
      )}

      {/* FY 2026/27 hero KPIs — always current year */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="FY 2026/27 Revenue (YTD)"
          value={fmt(ytdRevenue)}
          sub={`${currentYTD.months.length} month${currentYTD.months.length !== 1 ? "s" : ""} recorded · Apr 2026`}
          trend="up"
          large
        />
        <MetricCard
          label="Consulting (YTD)"
          value={fmt(ytdDDRevenue)}
          sub={ytdRevenue > 0 ? `${((ytdDDRevenue / ytdRevenue) * 100).toFixed(1)}% of total revenue` : "—"}
          trend="up"
          large
        />
        <MetricCard
          label="Four Hour Freedom (YTD)"
          value={fmt(ytdFHFRevenue)}
          sub={ytdRevenue > 0 ? `${((ytdFHFRevenue / ytdRevenue) * 100).toFixed(1)}% of total revenue` : "—"}
          trend="up"
          large
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Best Month This Year"
          value={FULL_MONTH[ytdBestMonth.month] ?? ytdBestMonth.month}
          sub={fmt(ytdBestMonth.revenue)}
          trend="up"
        />
        <MetricCard
          label="Monthly Average (YTD)"
          value={fmt(ytdMonthlyAvg)}
          sub={`vs £${Math.round(onTrackMonthly).toLocaleString()} needed for £80k goal`}
          trend={ytdMonthlyAvg >= onTrackMonthly ? "up" : "neutral"}
        />
        <MetricCard
          label="Net Position (YTD)"
          value={fmt(ytdNet)}
          sub={`${fmt(ytdExpenses)} expenses · ${((ytdNet / ytdRevenue) * 100).toFixed(1)}% margin`}
          trend={ytdNet >= 0 ? "up" : "down"}
        />
      </div>

      {/* FY 2026/27 — Revenue by Month (full year) */}
      <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-6" style={{ color: "var(--muted)" }}>
          FY 2026/27 — Revenue by Month
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={currentFYChartData} barGap={4} onClick={makeBarClickHandler(setCurrentFYExpanded)} style={{ cursor: "pointer" }}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis dataKey="month" tick={TICK} axisLine={false} tickLine={false} />
            <YAxis tick={TICK} axisLine={false} tickLine={false} tickFormatter={(v) => `£${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "#7ba8b8", fontSize: 12 }} />
            <ReferenceLine y={onTrackMonthly} stroke="#5a8fa0" strokeDasharray="4 4" label={{ value: "£80k pace", fill: "#5a8fa0", fontSize: 11, position: "insideTopRight" }} />
            <Bar dataKey="Consulting" stackId="a" fill="#d2782d">
              {currentFYChartData.map((entry, i) => (
                <Cell key={i} fill={entry.hasData ? "#d2782d" : "#1e4a5c"} />
              ))}
            </Bar>
            <Bar dataKey="Four Hour Freedom" stackId="a" radius={[4,4,0,0]}>
              {currentFYChartData.map((entry, i) => (
                <Cell key={i} fill={entry.hasData ? "#e8a045" : "#1a3f50"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>Click a bar to see the revenue breakdown · future months shown in grey · dashed line = £{Math.round(onTrackMonthly).toLocaleString()}/mo pace for £80k goal</p>
        <BreakdownPanel expanded={currentFYExpanded} onClose={() => setCurrentFYExpanded(null)} />
      </div>

      {/* FY 2026/27 Revenue Goal Tracker */}
      <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
              FY 2026/27 · £80,000 Revenue Goal
            </p>
            <p className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
              {fmt(ytdRevenue)} earned · {fmt(goalRemaining)} to go · {monthsLeft} months remaining
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold" style={{ color: goalProgress >= 100 ? "var(--accent-green)" : "var(--accent)" }}>
              {goalProgress.toFixed(1)}%
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>of {fmt(ANNUAL_GOAL)} target</p>
          </div>
        </div>
        {/* Progress bar with labels */}
        <div className="mb-2 relative" style={{ height: 28 }}>
          <div className="rounded-full overflow-hidden absolute inset-0" style={{ background: "var(--card-border)" }}>
            <div
              className="h-full rounded-full transition-all flex items-center justify-end pr-3"
              style={{
                width: `${Math.min(goalProgress, 100)}%`,
                background: goalProgress >= 100 ? "var(--accent-green)" : "var(--accent)",
                minWidth: goalProgress > 0 ? "2.5rem" : "0",
              }}
            >
              {goalProgress > 4 && (
                <span className="text-xs font-bold text-white">{goalProgress.toFixed(1)}%</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between text-xs mb-4" style={{ color: "var(--muted)" }}>
          <span>£0</span>
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>{fmt(ytdRevenue)} earned</span>
          <span>{fmt(ANNUAL_GOAL)} goal</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>YTD Revenue</p>
            <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{fmt(ytdRevenue)}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Apr 2026</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>Remaining</p>
            <p className="text-xl font-bold" style={{ color: "var(--accent)" }}>{fmt(goalRemaining)}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>to reach {fmt(ANNUAL_GOAL)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>Monthly Needed</p>
            <p className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{fmt(monthlyNeeded)}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>avg over {monthsLeft} months</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>On-Track Monthly</p>
            <p className="text-xl font-bold" style={{ color: "var(--muted)" }}>{fmt(onTrackMonthly)}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>flat spread over 12 months</p>
          </div>
        </div>
      </div>

      {/* Tax Pots + Outstanding Invoices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Tax pot tracker */}
        <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>Tax Set-Aside Tracker</h2>
          <div className="flex flex-col gap-4">

            {/* VAT pot */}
            <div className="rounded-lg p-4" style={{ background: "var(--background)", border: "1px solid var(--card-border)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase tracking-wider font-medium" style={{ color: "var(--muted)" }}>VAT Pot</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--card-border)", color: "var(--muted)" }}>Q1 Apr–Jun</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{fmt(taxPots.vat)}</p>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Current balance · next return due Aug 2026 · verify liability with GMBC</p>
            </div>

            {/* Corp Tax pot */}
            <div className="rounded-lg p-4" style={{ background: "var(--background)", border: corpTaxShortfall > 0 ? "1px solid var(--accent-red)" : "1px solid var(--card-border)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase tracking-wider font-medium" style={{ color: "var(--muted)" }}>Corp Tax Pot</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--card-border)", color: "var(--muted)" }}>19% of net profit</span>
              </div>
              <div className="flex items-end gap-3">
                <p className="text-2xl font-bold" style={{ color: corpTaxShortfall > 0 ? "var(--accent-red)" : "var(--accent)" }}>{fmt(taxPots.corpTax)}</p>
                <p className="text-sm mb-1" style={{ color: "var(--muted)" }}>of {fmt(estCorpTax)} recommended</p>
              </div>
              {corpTaxShortfall > 0 && (
                <p className="text-xs mt-1" style={{ color: "var(--accent-red)" }}>Shortfall: {fmt(corpTaxShortfall)} · consider topping up</p>
              )}
              {corpTaxShortfall === 0 && taxPots.corpTax > 0 && (
                <p className="text-xs mt-1" style={{ color: "var(--accent)" }}>On track ✓</p>
              )}
            </div>
          </div>
        </div>

        {/* Outstanding Invoices */}
        <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>Outstanding Invoices</h2>
          {outstandingInvoices.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>No outstanding invoices.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {outstandingInvoices.map((inv, i) => {
                const daysUntilDue = daysFromToday(inv.dueDate);
                const isOverdue = daysUntilDue < 0;
                const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 7;
                return (
                  <div key={i} className="rounded-lg p-4" style={{ background: "var(--background)", border: isOverdue ? "1px solid var(--accent-red)" : "1px solid var(--card-border)" }}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>{inv.client}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                          Invoiced {inv.invoicedDate} · due {inv.dueDate}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-lg" style={{ color: isOverdue ? "var(--accent-red)" : "var(--accent)" }}>{fmtExact(inv.amount)}</p>
                        <span className="text-xs px-2 py-0.5 rounded" style={{
                          background: isOverdue ? "var(--accent-red)" : isDueSoon ? "#6b4400" : "var(--card-border)",
                          color: isOverdue || isDueSoon ? "#fff" : "var(--muted)",
                        }}>
                          {isOverdue ? `${Math.abs(daysUntilDue)}d overdue` : daysUntilDue === 0 ? "Due today" : `Due in ${daysUntilDue}d`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between items-center pt-1 text-sm font-semibold" style={{ borderTop: "1px solid var(--card-border)" }}>
                <span style={{ color: "var(--muted)" }}>Total outstanding</span>
                <span style={{ color: "var(--foreground)" }}>{fmtExact(outstandingInvoices.reduce((s, i) => s + i.amount, 0))}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Proposal Pipeline */}
      <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Proposal Pipeline</h2>
          {proposals.length > 0 && (
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              {proposals.filter(p => p.stage !== "Closed Won" && p.stage !== "Closed Lost").length} active ·{" "}
              {fmt(proposals.filter(p => p.stage !== "Closed Won" && p.stage !== "Closed Lost").reduce((s, p) => s + p.value, 0))} in pipeline
            </p>
          )}
        </div>
        {proposals.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>No active proposals — add them to <code className="text-xs px-1 py-0.5 rounded" style={{ background: "var(--background)" }}>lib/data.ts</code> to track your pipeline here.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {STAGE_ORDER.map(stage => {
              const stageProposals = proposals.filter(p => p.stage === stage);
              return (
                <div key={stage}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STAGE_COLOR[stage] }} />
                    <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>{stage}</span>
                  </div>
                  {stageProposals.length === 0 ? (
                    <p className="text-xs" style={{ color: "var(--card-border)" }}>—</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {stageProposals.map((p, i) => (
                        <div key={i} className="rounded-lg p-3" style={{ background: "var(--background)", border: "1px solid var(--card-border)" }}>
                          <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>{p.client}</p>
                          <p className="text-sm font-bold mt-0.5" style={{ color: STAGE_COLOR[stage] }}>{fmt(p.value)}</p>
                          {p.notes && <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{p.notes}</p>}
                          <p className="text-xs mt-1" style={{ color: "var(--card-border)" }}>Updated {p.updatedDate}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Monthly Revenue comparison: this FY vs same months last FY */}
      <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-6" style={{ color: "var(--muted)" }}>
          FY 2026/27 vs {fy.label} — Same Months
        </h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={ytdComparisonData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis dataKey="month" tick={TICK} axisLine={false} tickLine={false} />
            <YAxis tick={TICK} axisLine={false} tickLine={false} tickFormatter={(v) => `£${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "#7ba8b8", fontSize: 12 }} />
            <Bar dataKey="FY 2026/27" fill="#d2782d" radius={[4, 4, 0, 0]} />
            <Bar dataKey={fy.label} fill="#5a8fa0" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>Showing months where FY 2026/27 data exists · change comparison year in the Prior Year section below</p>
      </div>

      {/* Prior year section */}
      <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
        <div>
          <h2 className="text-lg font-semibold">Prior Year Overview</h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{fy.period}</p>
        </div>
        <div className="flex items-center gap-2">
          {YEARS.map((y) => (
            <button
              key={y}
              onClick={() => setSelectedYear(y)}
              className="px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
              style={{
                background: selectedYear === y ? "var(--accent)" : "var(--card)",
                color: selectedYear === y ? "#fff" : "var(--muted)",
                border: "1px solid var(--card-border)",
              }}
            >
              {financialYears[y].label}
            </button>
          ))}
        </div>
      </div>

      {/* Prior year KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          label="Total Revenue"
          value={fmt(totalRevenue)}
          sub={revenueChange !== null ? `${pct(revenueChange)} vs prior year` : fy.period}
          trend="up"
          large
        />
        <MetricCard
          label="Best Revenue Month"
          value={bestMonth.month}
          sub={fmt(bestMonth.revenue)}
          trend="up"
          large
        />
        <MetricCard
          label="Avg Monthly Revenue"
          value={fmt(totalRevenue / 12)}
          sub="12-month average"
          trend="neutral"
          large
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard label="Total Expenses" value={fmt(totalExpenses)} sub={fy.period} trend="neutral" />
        <MetricCard label="Net Position" value={fmt(totalNet)} sub={`${((totalNet / totalRevenue) * 100).toFixed(1)}% of revenue`} trend="neutral" />
        <MetricCard label="Revenue vs Goal Pace" value={fmt(totalRevenue / 12)} sub={`need ${fmt(onTrackMonthly)}/mo for £80k`} trend={totalRevenue / 12 >= onTrackMonthly ? "up" : "neutral"} />
      </div>

      {/* YoY revenue comparison banner — current FY YTD vs same period prior year */}
      {ytdRevenueChange !== null && (
        <div className="rounded-xl p-5 flex flex-wrap gap-8 items-center" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>Revenue vs same period {fy.label}</p>
            <p className="text-2xl font-bold" style={{ color: ytdRevenueChange >= 0 ? "var(--accent)" : "var(--accent-red)" }}>{pct(ytdRevenueChange)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>Difference</p>
            <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{fmt(ytdRevenue - priorSamePeriod)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>FY 2026/27 YTD</p>
            <p className="text-2xl font-bold" style={{ color: "var(--accent)" }}>{fmt(ytdRevenue)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--muted)" }}>{fy.label} same period</p>
            <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{fmt(priorSamePeriod)}</p>
          </div>
        </div>
      )}

      {/* Revenue by Type + Expense breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-6" style={{ color: "var(--muted)" }}>Revenue by Brand — {fy.label}</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={fy.months.map(m => ({
                month: m.month,
                "Consulting": m.services + m.contentGen,
                "Four Hour Freedom": m.sales,
                breakdown: m.breakdown,
              }))}
              barGap={2}
              onClick={makeBarClickHandler(setPriorYearExpanded)}
              style={{ cursor: "pointer" }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
              <XAxis dataKey="month" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} tickFormatter={(v) => `£${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: "#7ba8b8", fontSize: 12 }} />
              <Bar dataKey="Consulting" fill="#d2782d" stackId="a" />
              <Bar dataKey="Four Hour Freedom" fill="#3c6978" stackId="a" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs mt-2" style={{ color: "var(--muted)" }}>Click a bar to see the revenue breakdown</p>
          <BreakdownPanel expanded={priorYearExpanded} onClose={() => setPriorYearExpanded(null)} />
        </div>

        <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>Expense Breakdown — {fy.label}</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie data={expenseSlices} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                  {expenseSlices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 flex-1 overflow-auto" style={{ maxHeight: 160 }}>
              {expenseSlices.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span style={{ color: "var(--muted)" }}>{item.name}</span>
                  </div>
                  <span style={{ color: "var(--foreground)" }}>{fmt(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Balance sheet trend */}
      <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-6" style={{ color: "var(--muted)" }}>
          Balance Sheet — Net Assets & Debtors
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={balanceSheetData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis dataKey="month" tick={TICK} axisLine={false} tickLine={false} />
            <YAxis tick={TICK} axisLine={false} tickLine={false} tickFormatter={(v) => `£${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ color: "#7ba8b8", fontSize: 12 }} />
            <Bar dataKey="assets" name="Net Assets" fill="#d2782d" radius={[4,4,0,0]} />
            <Bar dataKey="debtors" name="Debtors" fill="#e8a045" radius={[4,4,0,0]} />
            <Bar dataKey="cashAndBank" name="Cash & Bank" fill="#3c6978" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Income */}
        <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>Recent Income</h2>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                <th className="text-left pb-2 font-medium text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Date</th>
                <th className="text-left pb-2 font-medium text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Description</th>
                <th className="text-right pb-2 font-medium text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {incomeRows.map((t, i) => (
                <tr key={i} style={{ borderBottom: i < incomeRows.length - 1 ? "1px solid var(--card-border)" : "none" }}>
                  <td className="py-2.5 pr-3 text-xs whitespace-nowrap" style={{ color: "var(--muted)" }}>{t.date}</td>
                  <td className="py-2.5 pr-3" style={{ color: "var(--foreground)" }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      {t.description}
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                          background: t.brand === "Four Hour Freedom" ? "#3c6978" : "var(--accent)",
                          color: "#fff",
                          opacity: 0.85,
                        }}
                      >
                        {t.brand === "Four Hour Freedom" ? "FHF" : "DD"}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>{t.reference}</div>
                  </td>
                  <td className="py-2.5 text-right font-semibold whitespace-nowrap" style={{ color: "var(--accent)" }}>
                    +{fmtExact(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Outgoing */}
        <div className="rounded-xl p-6" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--muted)" }}>Recent Outgoings</h2>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                <th className="text-left pb-2 font-medium text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Date</th>
                <th className="text-left pb-2 font-medium text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Description</th>
                <th className="text-right pb-2 font-medium text-xs uppercase tracking-wider" style={{ color: "var(--muted)" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {outgoingRows.map((t, i) => (
                <tr key={i} style={{ borderBottom: i < outgoingRows.length - 1 ? "1px solid var(--card-border)" : "none" }}>
                  <td className="py-2.5 pr-3 text-xs whitespace-nowrap" style={{ color: "var(--muted)" }}>{t.date}</td>
                  <td className="py-2.5 pr-3" style={{ color: "var(--foreground)" }}>
                    <div className="flex items-center gap-2">
                      {t.description}
                      {t.status === "PENDING" && (
                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--card-border)", color: "var(--muted)" }}>Pending</span>
                      )}
                    </div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>{t.reference}</div>
                  </td>
                  <td className="py-2.5 text-right font-semibold whitespace-nowrap" style={{ color: "var(--accent-red)" }}>
                    -{fmtExact(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
