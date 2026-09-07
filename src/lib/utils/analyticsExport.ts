import { AnalyticsDashboardResponse } from '@/types/analytics.types';

export function exportAnalyticsToCsv(
  data: AnalyticsDashboardResponse,
  context: {
    scopeName?: string;
    campaignName?: string;
    dateRangeLabel?: string;
  } = {}
) {
  if (!data) return;

  const now = new Date().toISOString();
  const scope = context.scopeName || 'All Links';
  const campaign = context.campaignName || 'All Campaigns';
  const dateRange = context.dateRangeLabel || 'Last 30 Days';

  const rows: string[] = [];

  // Metadata Header
  rows.push('# ========================================================');
  rows.push('# Trimly Analytics Export Report');
  rows.push(`# Export Timestamp: ${now}`);
  rows.push(`# Scope: ${escapeCsv(scope)}`);
  rows.push(`# Campaign: ${escapeCsv(campaign)}`);
  rows.push(`# Date Range: ${escapeCsv(dateRange)}`);
  rows.push('# ========================================================');
  rows.push('');

  // 1. Executive Summary KPIs
  rows.push('# --- SECTION 1: EXECUTIVE KPI SUMMARY ---');
  rows.push('Metric,Value,Growth vs Prior Period');
  rows.push(`Total Clicks,${data.summary?.totalClicks ?? 0},${formatGrowth(data.summary?.clicksGrowth)}`);
  rows.push(`Unique Visitors,${data.summary?.uniqueVisitors ?? 0},${formatGrowth(data.summary?.uniqueGrowth)}`);
  rows.push(`QR Code Scans,${data.summary?.qrScans ?? 0},${formatGrowth(data.summary?.qrGrowth)}`);
  rows.push(`Web Link Clicks,${data.summary?.webClicks ?? 0},-`);
  rows.push(`QR Scan Adoption Rate,${data.summary?.qrPercentage ?? 0}%,-`);
  rows.push(`Top Location,${escapeCsv(data.summary?.topCountry || 'Global')},-`);
  rows.push(`Top Traffic Referrer,${escapeCsv(data.summary?.topReferrer || 'Direct / None')},-`);
  rows.push('');

  // 2. Time-Series Engagements
  rows.push('# --- SECTION 2: ENGAGEMENTS OVER TIME ---');
  rows.push('Date,Current Period Clicks,Previous Period Clicks,Unique Visitors');
  (data.timeSeries || []).forEach((pt) => {
    rows.push(`${escapeCsv(pt.date)},${pt.current ?? 0},${pt.previous ?? 0},${pt.currentUniques ?? 0}`);
  });
  rows.push('');

  // 3. Geographic Locations (Countries & Cities)
  rows.push('# --- SECTION 3: GEOGRAPHIC LOCATIONS ---');
  rows.push('Type,Name,Clicks,Percentage Share');
  (data.locations?.countries || []).forEach((c) => {
    rows.push(`Country,${escapeCsv(c.name)},${c.count},${c.percentage}%`);
  });
  (data.locations?.cities || []).forEach((city) => {
    rows.push(`City,${escapeCsv(`${city.city} (${city.country})`)},${city.count},${city.percentage}%`);
  });
  rows.push('');

  // 4. Referrers & Traffic Sources
  rows.push('# --- SECTION 4: TRAFFIC SOURCES & REFERRERS ---');
  rows.push('Referrer Domain,Category,Clicks,Percentage Share');
  (data.referrers || []).forEach((ref) => {
    rows.push(`${escapeCsv(ref.name)},${escapeCsv(ref.category || 'Referral')},${ref.count},${ref.percentage || 0}%`);
  });
  rows.push('');

  // 5. Hardware & Platform Breakdown
  rows.push('# --- SECTION 5: TECHNOLOGY & PLATFORMS ---');
  rows.push('Category,Platform / Name,Clicks,Percentage Share');
  (data.platforms?.devices || []).forEach((d) => {
    rows.push(`Device,${escapeCsv(d.name)},${d.count},${d.percentage || 0}%`);
  });
  (data.platforms?.os || []).forEach((o) => {
    rows.push(`Operating System,${escapeCsv(o.name)},${o.count},${o.percentage || 0}%`);
  });
  (data.platforms?.browsers || []).forEach((b) => {
    rows.push(`Browser,${escapeCsv(b.name)},${b.count},${b.percentage || 0}%`);
  });
  rows.push('');

  // 6. UTM Marketing Attribution
  rows.push('# --- SECTION 6: UTM CAMPAIGN ATTRIBUTION ---');
  rows.push('Dimension,Parameter Value,Clicks');
  (data.utms?.sources || []).forEach((s) => {
    rows.push(`UTM Source,${escapeCsv(s.name)},${s.count}`);
  });
  (data.utms?.mediums || []).forEach((m) => {
    rows.push(`UTM Medium,${escapeCsv(m.name)},${m.count}`);
  });
  (data.utms?.campaigns || []).forEach((camp) => {
    rows.push(`UTM Campaign,${escapeCsv(camp.name)},${camp.count}`);
  });

  const csvContent = rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const safeScope = scope.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const safeRange = dateRange.toLowerCase().replace(/[^a-z0-9]/g, '-');
  link.setAttribute('href', url);
  link.setAttribute('download', `trimly-analytics-${safeScope}-${safeRange}-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatGrowth(growth?: number): string {
  if (growth === undefined || growth === null) return '-';
  return growth >= 0 ? `+${growth}%` : `${growth}%`;
}
