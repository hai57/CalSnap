import { YT_ID_ALIASES } from './constants';

export function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function spotifyEmbed(url: string): string | null {
  let m = url.match(
    /spotify\.com\/(?:intl-\w+\/)?(track|playlist|album|artist|episode|show)\/([A-Za-z0-9]+)/,
  );
  if (!m) {
    m = url.match(
      /spotify:(track|playlist|album|artist|episode|show):([A-Za-z0-9]+)/,
    );
  }
  if (!m) return null;
  return `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0`;
}

export function spotifyPlaylistEmbed(id: string): string {
  return `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;
}

export function activeSpotifyPlaylist(url: string): string | null {
  const m = url.match(/embed\/playlist\/([A-Za-z0-9]+)/);
  return m?.[1] ?? null;
}

export function activeYtId(url: string): string | null {
  const m = url.match(/embed\/([a-zA-Z0-9_-]+)/);
  return m?.[1] ?? null;
}

export function resolveYtId(id: string): string {
  return YT_ID_ALIASES[id] ?? id;
}

export function youtubeEmbedUrl(
  videoId: string,
  opts?: { autoplay?: boolean; start?: number; origin?: string },
): string {
  const id = resolveYtId(videoId);
  const params = new URLSearchParams();
  params.set('enablejsapi', '1');
  if (opts?.origin) params.set('origin', opts.origin);
  if (opts?.autoplay) params.set('autoplay', '1');
  if (opts?.start != null && opts.start > 0) {
    params.set('start', String(Math.floor(opts.start)));
  }
  return `https://www.youtube.com/embed/${id}?${params}`;
}

export function youtubeEmbedUrlFromPersisted(
  url: string,
  opts?: { autoplay?: boolean; origin?: string },
): string {
  const id = activeYtId(url);
  if (!id) return url;
  const resolved = resolveYtId(id);
  const startMatch = url.match(/[?&]start=(\d+)/);
  const autoplay = opts?.autoplay ?? /[?&]autoplay=1/.test(url);
  return youtubeEmbedUrl(resolved, {
    autoplay,
    origin: opts?.origin,
    start: startMatch ? Number(startMatch[1]) : undefined,
  });
}
