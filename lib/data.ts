
export type OutstandingInvoice = {
  client: string
  amount: number
  invoicedDate: string
  dueDate: string
}

export type ProposalStage = "Discovery" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost"

export type Proposal = {
  client: string
  value: number
  stage: ProposalStage
  updatedDate: string
  notes?: string
}

export type MonthPayment = {
  client: string
  amount: number
  brand: "Four Hour Freedom" | "Consulting"
}

export type MonthData = {
  month: string
  revenue: number
  expenses: number
  net: number
  services: number
  sales: number
  contentGen: number
  breakdown: MonthPayment[]
}

export type FinancialYear = {
  label: string
  period: string
  months: MonthData[]
  expenses: Record<string, number>
}

export const financialYears: Record<string, FinancialYear> = {
  "2024/25": {
    label: "FY 2024/25",
    period: "Apr 2024 – Mar 2025",
    months: [
      {
        month: "Apr", revenue: 7329, expenses: 3840, net: 3489, services: 7200, sales: 129, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Northstar Commerce",   amount: 2400, brand: "Consulting"         },
          { client: "Meridian Digital",     amount: 1200, brand: "Consulting"         },
          { client: "Stripe",               amount:   87, brand: "Four Hour Freedom"  },
          { client: "PayPal",               amount:   42, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "May", revenue: 7324, expenses: 2890, net: 4434, services: 7200, sales: 124, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Northstar Commerce",   amount: 2400, brand: "Consulting"         },
          { client: "Meridian Digital",     amount: 1200, brand: "Consulting"         },
          { client: "Stripe",               amount:  124, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Jun", revenue: 8467, expenses: 2640, net: 5827, services: 8400, sales: 67, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Northstar Commerce",   amount: 3600, brand: "Consulting"         },
          { client: "Meridian Digital",     amount: 1200, brand: "Consulting"         },
          { client: "Stripe",               amount:   67, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Jul", revenue: 7231, expenses: 3120, net: 4111, services: 7200, sales: 31, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Northstar Commerce",   amount: 2400, brand: "Consulting"         },
          { client: "Meridian Digital",     amount: 1200, brand: "Consulting"         },
          { client: "Stripe",               amount:   31, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Aug", revenue: 7311, expenses: 2780, net: 4531, services: 7200, sales: 111, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Vertex Solutions",     amount: 2400, brand: "Consulting"         },
          { client: "Meridian Digital",     amount: 1200, brand: "Consulting"         },
          { client: "PayPal",               amount:   89, brand: "Four Hour Freedom"  },
          { client: "Stripe",               amount:   22, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Sep", revenue: 9018, expenses: 3450, net: 5568, services: 9000, sales: 18, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Northstar Commerce",   amount: 4200, brand: "Consulting"         },
          { client: "Meridian Digital",     amount: 1200, brand: "Consulting"         },
          { client: "Stripe",               amount:   18, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Oct", revenue: 9614, expenses: 2940, net: 6674, services: 9600, sales: 14, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Northstar Commerce",   amount: 2400, brand: "Consulting"         },
          { client: "Meridian Digital",     amount: 1200, brand: "Consulting"         },
          { client: "Vertex Solutions",     amount: 2400, brand: "Consulting"         },
          { client: "Stripe",               amount:   14, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Nov", revenue: 5041, expenses: 2720, net: 2321, services: 4800, sales: 241, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Meridian Digital",     amount: 1200, brand: "Consulting"         },
          { client: "PayPal",               amount:  178, brand: "Four Hour Freedom"  },
          { client: "Stripe",               amount:   63, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Dec", revenue: 3629, expenses: 2180, net: 1449, services: 3600, sales: 29, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Stripe",               amount:   29, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Jan", revenue: 6341, expenses: 3080, net: 3261, services: 6300, sales: 41, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Northstar Commerce",   amount: 1800, brand: "Consulting"         },
          { client: "Meridian Digital",     amount:  900, brand: "Consulting"         },
          { client: "Stripe",               amount:   41, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Feb", revenue: 5454, expenses: 2850, net: 2604, services: 5400, sales: 54, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Vertex Solutions",     amount: 1800, brand: "Consulting"         },
          { client: "Stripe",               amount:   36, brand: "Four Hour Freedom"  },
          { client: "PayPal",               amount:   18, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Mar", revenue: 5424, expenses: 3120, net: 2304, services: 5400, sales: 24, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Northstar Commerce",   amount: 1200, brand: "Consulting"         },
          { client: "Meridian Digital",     amount:  600, brand: "Consulting"         },
          { client: "Stripe",               amount:   24, brand: "Four Hour Freedom"  },
        ],
      },
    ],
    expenses: {
      "Directors' Pay":          24000,
      "PAYE & NI":                2840,
      "Accountancy Fees":         1800,
      "Software & Subscriptions": 1240,
      "Equipment & Hardware":     3200,
      "Marketing & Advertising":   890,
      "Training & Development":    650,
      "Office & Administration":   480,
      "Travel & Subsistence":      370,
      "Professional Insurance":    920,
    },
  },

  "2025/26": {
    label: "FY 2025/26",
    period: "Apr 2025 – Mar 2026",
    months: [
      {
        month: "Apr", revenue: 7315, expenses: 2840, net: 4475, services: 7200, sales: 115, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Northstar Commerce",   amount: 2400, brand: "Consulting"         },
          { client: "Meridian Digital",     amount: 1200, brand: "Consulting"         },
          { client: "PayPal",               amount:   84, brand: "Four Hour Freedom"  },
          { client: "Stripe",               amount:   31, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "May", revenue: 7247, expenses: 2720, net: 4527, services: 7200, sales: 47, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Northstar Commerce",   amount: 2400, brand: "Consulting"         },
          { client: "Meridian Digital",     amount: 1200, brand: "Consulting"         },
          { client: "Stripe",               amount:   47, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Jun", revenue: 4857, expenses: 2180, net: 2677, services: 4800, sales: 57, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Meridian Digital",     amount: 1200, brand: "Consulting"         },
          { client: "PayPal",               amount:   38, brand: "Four Hour Freedom"  },
          { client: "Stripe",               amount:   19, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Jul", revenue: 4222, expenses: 2340, net: 1882, services: 4200, sales: 22, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Meridian Digital",     amount:  600, brand: "Consulting"         },
          { client: "Stripe",               amount:   22, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Aug", revenue: 3615, expenses: 1980, net: 1635, services: 3600, sales: 15, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "Stripe",               amount:   15, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Sep", revenue: 5428, expenses: 2140, net: 3288, services: 5400, sales: 28, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "BluePeak Media",        amount: 1800, brand: "Consulting"         },
          { client: "Stripe",               amount:   28, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Oct", revenue: 6011, expenses: 2280, net: 3731, services: 6000, sales: 11, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "BluePeak Media",        amount: 2400, brand: "Consulting"         },
          { client: "Stripe",               amount:   11, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Nov", revenue: 5650, expenses: 2060, net: 3590, services: 5400, sales: 250, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "BluePeak Media",        amount: 1800, brand: "Consulting"         },
          { client: "PayPal",               amount:  183, brand: "Four Hour Freedom"  },
          { client: "Stripe",               amount:   67, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Dec", revenue: 4831, expenses: 1840, net: 2991, services: 4800, sales: 31, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "BluePeak Media",        amount: 1200, brand: "Consulting"         },
          { client: "Stripe",               amount:   31, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Jan", revenue: 5418, expenses: 2180, net: 3238, services: 5400, sales: 18, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "BluePeak Media",        amount: 1800, brand: "Consulting"         },
          { client: "Stripe",               amount:   18, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Feb", revenue: 3665, expenses: 1940, net: 1725, services: 3600, sales: 65, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "PayPal",               amount:   44, brand: "Four Hour Freedom"  },
          { client: "Stripe",               amount:   21, brand: "Four Hour Freedom"  },
        ],
      },
      {
        month: "Mar", revenue: 7229, expenses: 2300, net: 4929, services: 7200, sales: 29, contentGen: 0,
        breakdown: [
          { client: "Apex Growth Partners", amount: 3600, brand: "Consulting"         },
          { client: "BluePeak Media",        amount: 2400, brand: "Consulting"         },
          { client: "Meridian Digital",     amount: 1200, brand: "Consulting"         },
          { client: "Stripe",               amount:   29, brand: "Four Hour Freedom"  },
        ],
      },
    ],
    expenses: {
      "Directors' Pay":          18000,
      "PAYE & NI":                2140,
      "Accountancy Fees":         1800,
      "Software & Subscriptions": 1180,
      "Equipment & Hardware":      680,
      "Marketing & Advertising":   420,
      "Training & Development":    290,
      "Office & Administration":   390,
      "Travel & Subsistence":      180,
      "Professional Insurance":    920,
    },
  },
}

export const currentYTD = {
  label: "FY 2026/27 YTD",
  period: "Apr 2026 – May 2026",
  months: [
    {
      month: "Apr", revenue: 9234, expenses: 3480, net: 5754, services: 9000, sales: 234, contentGen: 0,
      breakdown: [
        { client: "Apex Growth Partners", amount: 4800, brand: "Consulting" as const         },
        { client: "BluePeak Media",        amount: 2400, brand: "Consulting" as const         },
        { client: "Vertex Solutions",     amount: 1800, brand: "Consulting" as const         },
        { client: "Stripe",               amount:  180, brand: "Four Hour Freedom" as const  },
        { client: "PayPal",               amount:   54, brand: "Four Hour Freedom" as const  },
      ],
    },
    {
      month: "May", revenue: 6182, expenses: 2640, net: 3542, services: 6000, sales: 182, contentGen: 0,
      breakdown: [
        { client: "Apex Growth Partners", amount: 4800, brand: "Consulting" as const         },
        { client: "BluePeak Media",        amount: 1200, brand: "Consulting" as const         },
        { client: "Stripe",               amount:  142, brand: "Four Hour Freedom" as const  },
        { client: "PayPal",               amount:   40, brand: "Four Hour Freedom" as const  },
      ],
    },
  ],
}

export const balanceSheetData = [
  { month: "Sep 25", assets: 12840, cashAndBank: 4280,  debtors: 3600 },
  { month: "Oct 25", assets: 14120, cashAndBank: 5310,  debtors: 3600 },
  { month: "Nov 25", assets: 13890, cashAndBank: 4820,  debtors: 3600 },
  { month: "Dec 25", assets: 12480, cashAndBank: 3940,  debtors: 3600 },
  { month: "Jan 26", assets: 13240, cashAndBank: 5180,  debtors: 1800 },
  { month: "Feb 26", assets: 11380, cashAndBank: 2940,  debtors: 3600 },
  { month: "Mar 26", assets: 14820, cashAndBank: 4680,  debtors: 7200 },
  { month: "Apr 26", assets: 16240, cashAndBank: 5840,  debtors: 7200 },
]

export type Transaction = {
  date: string
  description: string
  reference: string
  amount: number
  category: string
  direction: "IN" | "OUT"
  status: "SETTLED" | "PENDING"
  brand: "Four Hour Freedom" | "Consulting"
}

export const recentTransactions: Transaction[] = [
  { date: "4 May 2026",  description: "Stripe Payments UK Ltd", reference: "STRIPE PAYOUT",           amount:  142.00, category: "Revenue",        direction: "IN",  status: "SETTLED", brand: "Four Hour Freedom" },
  { date: "2 May 2026",  description: "PayPal",                 reference: "PAYPAL TRANSFER",          amount:   40.00, category: "Revenue",        direction: "IN",  status: "SETTLED", brand: "Four Hour Freedom" },
  { date: "1 May 2026",  description: "Xero Accounting",        reference: "XERO *SUBSCRIPTION",       amount:   42.00, category: "Software",       direction: "OUT", status: "SETTLED", brand: "Consulting"         },
  { date: "28 Apr 2026", description: "Apex Growth Partners",   reference: "MAY RETAINER",             amount: 4800.00, category: "Revenue",        direction: "IN",  status: "SETTLED", brand: "Consulting"         },
  { date: "27 Apr 2026", description: "Alex Hargreaves",        reference: "APR-2026 SALARY",          amount: 2000.00, category: "Directors' Pay", direction: "OUT", status: "SETTLED", brand: "Consulting"         },
  { date: "25 Apr 2026", description: "BluePeak Media",         reference: "APRIL CONTENT RETAINER",   amount: 2400.00, category: "Revenue",        direction: "IN",  status: "SETTLED", brand: "Consulting"         },
  { date: "23 Apr 2026", description: "Microsoft 365",          reference: "MSFT *SUBSCRIPTION",       amount:   22.80, category: "Software",       direction: "OUT", status: "SETTLED", brand: "Consulting"         },
  { date: "22 Apr 2026", description: "Vertex Solutions",       reference: "STRATEGY WORKSHOP",        amount: 1800.00, category: "Revenue",        direction: "IN",  status: "SETTLED", brand: "Consulting"         },
  { date: "20 Apr 2026", description: "Hmrc",                   reference: "PAYE APRIL 2026",          amount:  380.00, category: "Tax",            direction: "OUT", status: "SETTLED", brand: "Consulting"         },
  { date: "18 Apr 2026", description: "Ahrefs",                 reference: "AHREFS.COM SUBSCRIPTION",  amount:   89.00, category: "Software",       direction: "OUT", status: "SETTLED", brand: "Consulting"         },
  { date: "15 Apr 2026", description: "Stripe Payments UK Ltd", reference: "STRIPE PAYOUT",            amount:  180.00, category: "Revenue",        direction: "IN",  status: "SETTLED", brand: "Four Hour Freedom" },
  { date: "14 Apr 2026", description: "Clarity Accountants",    reference: "MONTHLY BOOKKEEPING",      amount:  180.00, category: "Accountancy",    direction: "OUT", status: "SETTLED", brand: "Consulting"         },
  { date: "12 Apr 2026", description: "PayPal",                 reference: "PAYPAL TRANSFER",          amount:   54.00, category: "Revenue",        direction: "IN",  status: "SETTLED", brand: "Four Hour Freedom" },
  { date: "10 Apr 2026", description: "Zoom",                   reference: "ZOOM.US *SUBSCRIPTION",    amount:   14.39, category: "Software",       direction: "OUT", status: "SETTLED", brand: "Consulting"         },
  { date: "8 Apr 2026",  description: "Clarity Accountants",    reference: "MARCH BOOKKEEPING",        amount:  180.00, category: "Accountancy",    direction: "OUT", status: "SETTLED", brand: "Consulting"         },
  { date: "7 Apr 2026",  description: "Vodafone",               reference: "VODAFONE BUSINESS",        amount:   45.00, category: "Equipment",      direction: "OUT", status: "SETTLED", brand: "Consulting"         },
  { date: "4 Apr 2026",  description: "GitHub",                 reference: "GITHUB PRO MONTHLY",       amount:    9.99, category: "Software",       direction: "OUT", status: "SETTLED", brand: "Consulting"         },
  { date: "2 Apr 2026",  description: "Hmrc",                   reference: "CORPORATION TAX Q1",       amount:  240.00, category: "Tax",            direction: "OUT", status: "SETTLED", brand: "Consulting"         },
]

export const taxPots = {
  vat: 2340,
  corpTax: 890,
}

export const outstandingInvoices: OutstandingInvoice[] = [
  { client: "Apex Growth Partners", amount: 1800.00, invoicedDate: "2026-05-01", dueDate: "2026-05-28" },
]

export const proposals: Proposal[] = [
  { client: "Vertex Solutions Retainer",    value: 24000, stage: "Negotiation", updatedDate: "2026-05-02" },
  { client: "BluePeak Media SEO Expansion", value:  4800, stage: "Proposal",    updatedDate: "2026-05-04" },
  { client: "Northstar Commerce Phase 3",   value:  8400, stage: "Discovery",   updatedDate: "2026-04-28" },
]

export const marketingData = {
  newsletter: {
    platform: "Substack",
    subscribers: [] as { month: string; total: number; newSubs: number; openRate: number }[],
  },
  social: {
    linkedin: [] as { month: string; impressions: number; engagements: number; posts: number }[],
    substackNotes: [] as { month: string; views: number; likes: number; notes: number }[],
  },
}
