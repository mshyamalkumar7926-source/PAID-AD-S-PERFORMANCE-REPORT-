# AdPulse — Paid Ads Performance Report

A clean, dark-themed static website for visualising paid advertising performance across channels. No build tools or dependencies required — just open `index.html` in a browser.

---

## 📁 File Structure

```
adpulse/
├── index.html   — Main report page (structure & content)
├── style.css    — All styling, theming, animations
├── script.js    — Interactivity & dynamic behaviour
└── README.md    — This file
```

---

## 🚀 Getting Started

1. Download or clone all four files into the same folder.
2. Open `index.html` in any modern browser.
3. No server, no npm, no build step needed.

---

## 📊 Report Sections

| Section | Description |
|---|---|
| **Header** | Logo, report period, live clock, export button, scrolling metrics ticker |
| **KPI Strip** | 6 animated cards — Spend, Revenue, ROAS, Conversions, CPC, CTR |
| **Channel Breakdown** | Sortable table across 6 ad channels with colour-coded ROAS pills |
| **Spend Distribution** | SVG donut chart with hover tooltips showing budget allocation |
| **Weekly Trend** | CSS bar chart comparing Revenue vs Spend over 4 weeks |
| **Top Campaigns** | Full campaign table with channel tags, status badges, sortable rows |
| **Insights Strip** | 3 actionable recommendations with visual severity indicators |

---

## ⚙️ script.js Features

| Feature | Description |
|---|---|
| `initCounters()` | KPI values animate from 0 on page load using eased counters |
| `initScrollAnimations()` | Panels fade in as they enter the viewport (IntersectionObserver) |
| `initTableTooltips()` | Campaign rows are clickable with drill-down placeholder feedback |
| `initExportButton()` | Export button triggers `window.print()` for PDF saving |
| `initDonutHover()` | Donut chart segments show spend details on hover via toast |
| `initTableSort()` | Click any column header in the Channel Breakdown to sort |
| `initLiveClock()` | Report period label updates with a live ticking clock |
| `initBarTooltips()` | Weekly bar chart groups show Revenue + Spend on hover |
| `initThemeToggle()` | ☀/🌙 button toggles between dark and light mode via CSS variables |
| `showToast()` | Shared toast notification helper used across all features |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0b0c0e` | Page background |
| `--bg-panel` | `#111316` | Card / panel background |
| `--accent` | `#f0ff4b` | Highlight yellow (ROAS card, bars) |
| `--positive` | `#4ade80` | Good ROAS, positive deltas |
| `--warn` | `#fbbf24` | Mid-range ROAS |
| `--negative` | `#f87171` | Low ROAS, negative deltas |
| `--font-display` | Syne | Headings, KPI values, ranks |
| `--font-mono` | DM Mono | Data, labels, body text |

All colours are CSS custom properties on `:root` — swap them to rebrand instantly.

---

## 🖨️ Printing / PDF Export

Click **Export PDF** in the header, or use your browser's **File → Print** menu. The report is designed to print cleanly — background colours are preserved via `-webkit-print-color-adjust: exact`.

For best results: Chrome or Edge, A4 landscape, margins set to "None".

---

## 📐 Browser Support

| Browser | Support |
|---|---|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |

---

## 📝 Customising the Data

All data is hardcoded in `index.html`. To update:

- **KPI values** — edit the `.kpi-value` text content, and update matching targets in `script.js` → `initCounters()`
- **Channel rows** — edit `<tr>` rows inside `#channels .data-table tbody`
- **Campaign rows** — edit `<tr>` rows inside `.campaigns-table tbody`
- **Donut chart** — update `stroke-dasharray` values in the SVG segments (circumference = 2π × 70 ≈ 439.8px)
- **Bar chart** — adjust `--rev` and `--spd` CSS variables on each `.bar-group`

---

## 📄 License

MIT — free to use, modify, and distribute.
