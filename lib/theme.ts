export type VisualMode = 'crystal' | 'dark';

export type PaletteKey = 'blue-violet' | 'emerald-teal' | 'titan-electric' | 'wine-rose' | 'amber-orange';

export const palettes: Record<PaletteKey, { accent: string; accent2: string; bg1: string; bg2: string }> = {
  'blue-violet': { accent: '#7EA4FF', accent2: '#A48CFF', bg1: '#1D2957', bg2: '#2A1F49' },
  'emerald-teal': { accent: '#4BB58B', accent2: '#2B7C90', bg1: '#0F2B2B', bg2: '#162E44' },
  'titan-electric': { accent: '#7B879A', accent2: '#5B7CA8', bg1: '#1A1F29', bg2: '#1D2A3D' },
  'wine-rose': { accent: '#7A3E57', accent2: '#B9879E', bg1: '#2E1521', bg2: '#351C2D' },
  'amber-orange': { accent: '#A66D2F', accent2: '#CC8A4E', bg1: '#2E2419', bg2: '#35261A' }
};
