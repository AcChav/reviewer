// Predefined colors for common domains
const PRESET_COLORS = {
  frontend: 'bg-cyan-950/60 border-cyan-800 text-cyan-300',
  backend: 'bg-emerald-950/60 border-emerald-800 text-emerald-300',
  database: 'bg-amber-950/60 border-amber-800 text-amber-300',
  devops: 'bg-purple-950/60 border-purple-800 text-purple-300',
  architecture: 'bg-rose-950/60 border-rose-800 text-rose-300',
  general: 'bg-slate-800/80 border-slate-700 text-slate-300',
};

// Fallback palette for any dynamic/custom categories
const DYNAMIC_PALETTE = [
  'bg-indigo-950/60 border-indigo-800 text-indigo-300',
  'bg-teal-950/60 border-teal-800 text-teal-300',
  'bg-pink-950/60 border-pink-800 text-pink-300',
  'bg-orange-950/60 border-orange-800 text-orange-300',
  'bg-sky-950/60 border-sky-800 text-sky-300',
  'bg-lime-950/60 border-lime-800 text-lime-300',
];

export function getCategoryBadgeStyle(category = '') {
  const normalized = category.toLowerCase().trim();

  if (PRESET_COLORS[normalized]) {
    return PRESET_COLORS[normalized];
  }

  // Generate deterministic color index for custom categories
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % DYNAMIC_PALETTE.length;

  return DYNAMIC_PALETTE[index];
}