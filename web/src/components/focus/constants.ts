export type TabId = 'spotify' | 'youtube' | 'coding' | 'work';
export type Todo = { id: string; text: string; done: boolean };
export type Link = { name: string; url: string };

export const K = (key: string) => `nutrilens_worktab_${key}`;

export const DEFAULT_SPOTIFY =
  'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0';
export const DEFAULT_YT = 'https://www.youtube.com/embed/jfKfPfyJRdk';

export const ENGINES: {
  id: string;
  label: string;
  url: (q: string) => string;
}[] = [
  {
    id: 'google',
    label: 'Google',
    url: (q) => `https://www.google.com/search?q=${q}`,
  },
  {
    id: 'stackoverflow',
    label: 'Stack Overflow',
    url: (q) => `https://stackoverflow.com/search?q=${q}`,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    url: (q) => `https://www.youtube.com/results?search_query=${q}`,
  },
  {
    id: 'github',
    label: 'GitHub',
    url: (q) => `https://github.com/search?q=${q}`,
  },
  {
    id: 'mdn',
    label: 'MDN',
    url: (q) => `https://developer.mozilla.org/en-US/search?q=${q}`,
  },
];

export const SPOTIFY_PRESETS: { label: string; playlist: string }[] = [
  { label: 'Lofi radio', playlist: '37i9dQZF1DWWQRwui0ExPn' },
  { label: 'Deep Focus', playlist: '37i9dQZF1DWZeKCadgRdKQ' },
  { label: 'Peaceful Piano', playlist: '37i9dQZF1DX4sWSpwq3LiO' },
  { label: 'Nature sounds', playlist: '37i9dQZF1DX4PP3AWZW4L8' },
];

export const STATIONS: { lbl: string; c: string; yt: string }[] = [
  { lbl: 'Lofi Girl', c: '#ff5e7e', yt: 'jfKfPfyJRdk' },
  { lbl: 'Synthwave', c: '#b06cff', yt: '4xDzrJKXOOY' },
  { lbl: 'Jazz Cafe', c: '#d99a47', yt: 'Dx5qFachd3A' },
  { lbl: 'Deep Focus', c: '#1db954', yt: '5yx6BWlEVcY' },
  { lbl: 'Classical', c: '#6c8cff', yt: 'jgpJVI3tDbY' },
  { lbl: 'Rain Sounds', c: '#4aa3df', yt: 'mPZkdNFkNps' },
];

export const CODE_SHORTCUTS: { lbl: string; c: string; url: string }[] = [
  { lbl: 'Stack Overflow', c: '#f48024', url: 'https://stackoverflow.com' },
  { lbl: 'GitHub', c: '#333', url: 'https://github.com' },
  { lbl: 'MDN', c: '#000', url: 'https://developer.mozilla.org' },
  { lbl: '.NET Docs', c: '#512bd4', url: 'https://learn.microsoft.com/dotnet' },
  { lbl: 'DevDocs', c: '#2b3a42', url: 'https://devdocs.io' },
  { lbl: 'regex101', c: '#3a8a3a', url: 'https://regex101.com' },
];

export const DEV_ENGINES: {
  id: string;
  label: string;
  url: (q: string) => string;
}[] = [
  {
    id: 'github',
    label: 'GitHub',
    url: (q) => `https://github.com/search?q=${q}`,
  },
  {
    id: 'mdn',
    label: 'MDN Web Docs',
    url: (q) => `https://developer.mozilla.org/en-US/search?q=${q}`,
  },
  {
    id: 'npm',
    label: 'npm',
    url: (q) => `https://www.npmjs.com/search?q=${q}`,
  },
  {
    id: 'nuget',
    label: 'NuGet',
    url: (q) => `https://www.nuget.org/packages?q=${q}`,
  },
  {
    id: 'devdocs',
    label: 'DevDocs',
    url: (q) => `https://devdocs.io/#q=${q}`,
  },
  {
    id: 'caniuse',
    label: 'Can I Use',
    url: (q) => `https://caniuse.com/?search=${q}`,
  },
];

export const PALETTE = [
  '#e8a838',
  '#6c8cff',
  '#1db954',
  '#f48024',
  '#ff5e7e',
  '#4aa3df',
  '#b06cff',
];

export const DEFAULT_LINKS: Link[] = [
  { name: 'Gmail', url: 'https://mail.google.com' },
  { name: 'Calendar', url: 'https://calendar.google.com' },
  { name: 'GitHub', url: 'https://github.com' },
  { name: 'ChatGPT', url: 'https://chat.openai.com' },
];

export const TAB_ICONS: Record<TabId, string> = {
  spotify: '♫',
  youtube: '▶',
  coding: '</>',
  work: '▣',
};

export const VALID_TABS: TabId[] = ['spotify', 'youtube', 'coding', 'work'];

export const MODES: { id: string; label: string; minutes: number }[] = [
  { id: 'work', label: 'Work', minutes: 25 },
  { id: 'short', label: 'Short break', minutes: 5 },
  { id: 'long', label: 'Long break', minutes: 15 },
];
