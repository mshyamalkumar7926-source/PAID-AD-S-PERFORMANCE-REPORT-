/* ============================================================
   AdPulse — Paid Ads Performance Report
   script.js  — Interactivity & Dynamic Behaviour
   ============================================================ */

'use strict';

/* ── 1. Animated Counter (KPI values) ── */
function animateCounter(el, target, prefix = '', suffix = '', decimals = 0) {
  const duration = 1200;
  const start = performance.now();
  const from = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = from + (target - from) * eased;
    el.textContent = prefix + value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const counters = [
    { selector: '.kpi-card:nth-child(1) .kpi-value', target: 68400,  prefix: '$', suffix: '',  decimals: 0 },
    { selector: '.kpi-card:nth-child(2) .kpi-value', target: 287280, prefix: '$', suffix: '',  decimals: 0 },
    { selector: '.kpi-card:nth-child(3) .kpi-value', target: 4.2,    prefix: '',  suffix: 'x', decimals: 1 },
    { selector: '.kpi-card:nth-child(4) .kpi-value', target: 8412,   prefix: '',  suffix: '',  decimals: 0 },
    { selector: '.kpi-card:nth-child(5) .kpi-value', target: 0.82,   prefix: '$', suffix: '',  decimals: 2 },
    { selector: '.kpi-card:nth-child(6) .kpi-value', target: 3.8,    prefix: '',  suffix: '%', decimals: 1 },
  ];

  counters.forEach(({ selector, target, prefix, suffix, decimals }) => {
    const el = document.querySelector(selector);
    if (el) animateCounter(el, target, prefix, suffix, decimals);
  });
}

/* ── 2. Intersection Observer — animate on scroll ── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.panel, .insight-card, .kpi-card')
    .forEach(el => observer.observe(el));
}

/* ── 3. Table Row Hover Tooltip ── */
function initTableTooltips() {
  const rows = document.querySelectorAll('.campaigns-table tbody tr');
  rows.forEach(row => {
    row.setAttribute('title', 'Click to drill down');
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      const name = row.querySelector('.camp-name')?.textContent.trim();
      if (name) showToast(`📊 "${name}" — drill-down coming soon`);
    });
  });
}

/* ── 4. Export Button ── */
function initExportButton() {
  const btn = document.querySelector('.export-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    btn.textContent = 'Generating…';
    btn.disabled = true;
    setTimeout(() => {
      window.print();
      btn.textContent = 'Export PDF';
      btn.disabled = false;
    }, 600);
  });
}

/* ── 5. Toast Notification ── */
function showToast(message) {
  let toast = document.getElementById('adpulse-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adpulse-toast';
    toast.style.cssText = `
      position: fixed; bottom: 28px; right: 28px;
      background: #1a1d24; border: 1px solid #2a2d34;
      color: #e8eaf0; font-family: 'DM Mono', monospace;
      font-size: 12px; padding: 12px 18px; border-radius: 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      transform: translateY(20px); opacity: 0;
      transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
      z-index: 9999; max-width: 320px;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
  }, 3000);
}

/* ── 6. Donut Segment Hover Labels ── */
function initDonutHover() {
  const segments = document.querySelectorAll('.donut-seg');
  const labels = [
    { name: 'Google Search', spend: '$28,200', pct: '41%' },
    { name: 'Meta Ads',      spend: '$18,400', pct: '27%' },
    { name: 'YouTube',       spend: '$9,600',  pct: '14%' },
    { name: 'LinkedIn',      spend: '$7,200',  pct: '11%' },
    { name: 'TikTok',        spend: '$3,400',  pct: '5%'  },
    { name: 'Display',       spend: '$1,600',  pct: '2%'  },
  ];

  segments.forEach((seg, i) => {
    seg.style.cursor = 'pointer';
    seg.addEventListener('mouseenter', () => {
      const d = labels[i];
      if (d) showToast(`${d.name} · ${d.spend} · ${d.pct} of budget`);
    });
  });
}

/* ── 7. Channel Table — Sort on Header Click ── */
function initTableSort() {
  const table = document.querySelector('#channels .data-table');
  if (!table) return;

  const headers = table.querySelectorAll('thead th');
  let sortCol = -1;
  let sortAsc = true;

  headers.forEach((th, colIdx) => {
    th.style.cursor = 'pointer';
    th.title = 'Click to sort';
    th.addEventListener('click', () => {
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));

      if (sortCol === colIdx) {
        sortAsc = !sortAsc;
      } else {
        sortCol = colIdx;
        sortAsc = true;
      }

      rows.sort((a, b) => {
        const aText = a.cells[colIdx]?.textContent.trim().replace(/[$,x%]/g, '') || '';
        const bText = b.cells[colIdx]?.textContent.trim().replace(/[$,x%]/g, '') || '';
        const aVal = parseFloat(aText) || aText;
        const bVal = parseFloat(bText) || bText;

        if (aVal < bVal) return sortAsc ? -1 : 1;
        if (aVal > bVal) return sortAsc ? 1 : -1;
        return 0;
      });

      rows.forEach(row => tbody.appendChild(row));

      // Update header arrows
      headers.forEach(h => h.textContent = h.textContent.replace(/ [▲▼]$/, ''));
      th.textContent += sortAsc ? ' ▲' : ' ▼';

      showToast(`Sorted by "${th.textContent.replace(/ [▲▼]$/, '').trim()}"`);
    });
  });
}

/* ── 8. Live Clock in Header ── */
function initLiveClock() {
  const meta = document.querySelector('.report-period');
  if (!meta) return;

  const base = meta.textContent;

  function tick() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    meta.textContent = `${base} · ${time}`;
  }

  tick();
  setInterval(tick, 1000);
}

/* ── 9. Bar Chart — Tooltip on Hover ── */
function initBarTooltips() {
  const data = [
    { rev: '$62K', spd: '$24K' },
    { rev: '$54K', spd: '$19K' },
    { rev: '$78K', spd: '$22K' },
    { rev: '$93K', spd: '$26K' },
  ];

  const groups = document.querySelectorAll('.bar-group');
  groups.forEach((group, i) => {
    group.style.cursor = 'pointer';
    group.addEventListener('mouseenter', () => {
      const d = data[i];
      if (d) showToast(`Week ${i + 1} · Revenue: ${d.rev} · Spend: ${d.spd}`);
    });
  });
}

/* ── 10. Theme Toggle (bonus) ── */
function initThemeToggle() {
  // Add toggle button to header
  const headerMeta = document.querySelector('.header-meta');
  if (!headerMeta) return;

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-toggle-btn';
  toggleBtn.textContent = '☀';
  toggleBtn.title = 'Toggle light mode';
  toggleBtn.style.cssText = `
    background: transparent;
    border: 1px solid #2a2d34;
    color: #6b7180;
    width: 32px; height: 32px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  `;

  let light = false;
  toggleBtn.addEventListener('click', () => {
    light = !light;
    if (light) {
      document.documentElement.style.setProperty('--bg', '#f4f5f7');
      document.documentElement.style.setProperty('--bg-panel', '#ffffff');
      document.documentElement.style.setProperty('--bg-panel-2', '#f0f1f4');
      document.documentElement.style.setProperty('--border', '#e0e2e8');
      document.documentElement.style.setProperty('--border-light', '#c8cad4');
      document.documentElement.style.setProperty('--text', '#111316');
      document.documentElement.style.setProperty('--text-muted', '#6b7180');
      document.documentElement.style.setProperty('--text-dim', '#bbbec8');
      toggleBtn.textContent = '🌙';
      toggleBtn.title = 'Toggle dark mode';
    } else {
      document.documentElement.style.setProperty('--bg', '#0b0c0e');
      document.documentElement.style.setProperty('--bg-panel', '#111316');
      document.documentElement.style.setProperty('--bg-panel-2', '#16181d');
      document.documentElement.style.setProperty('--border', '#222428');
      document.documentElement.style.setProperty('--border-light', '#2a2d34');
      document.documentElement.style.setProperty('--text', '#e8eaf0');
      document.documentElement.style.setProperty('--text-muted', '#6b7180');
      document.documentElement.style.setProperty('--text-dim', '#3d4150');
      toggleBtn.textContent = '☀';
      toggleBtn.title = 'Toggle light mode';
    }
  });

  headerMeta.insertBefore(toggleBtn, headerMeta.firstChild);
}

/* ── Init All ── */
document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initScrollAnimations();
  initTableTooltips();
  initExportButton();
  initDonutHover();
  initTableSort();
  initLiveClock();
  initBarTooltips();
  initThemeToggle();

  showToast('📈 AdPulse report loaded · Q2 2026');
});
