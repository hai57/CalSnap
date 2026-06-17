import { K, VALID_TABS, TabId } from '@src/components/focus/constants';
import { useState } from 'react';

export function readTab(): TabId {
  try {
    const raw = window.localStorage.getItem(K('tab'));
    if (raw == null) return 'spotify';
    const v = JSON.parse(raw) as string;
    if (v === 'music') return 'spotify';
    return VALID_TABS.includes(v as TabId) ? (v as TabId) : 'spotify';
  } catch {
    return 'spotify';
  }
}

export function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw == null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });
  const update = (next: T) => {
    setValue(next);
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // ignore storage failures
    }
  };
  return [value, update] as const;
}

export function spotifyEmbed(url: string): string | null {
  let m = url.match(
    /spotify\.com\/(?:intl-\w+\/)?(track|playlist|album|artist|episode|show)\/([A-Za-z0-9]+)/,
  );
  if (!m)
    m = url.match(
      /spotify:(track|playlist|album|artist|episode|show):([A-Za-z0-9]+)/,
    );
  if (!m) return null;
  return `https://open.spotify.com/embed/${m[1]}/${m[2]}?utm_source=generator&theme=0`;
}

export function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function spotifyFrameSize(
  url: string,
): 'compact' | 'album' | 'playlist' {
  if (/embed\/(track|episode)\//.test(url)) return 'compact';
  if (/embed\/(album|artist)\//.test(url)) return 'album';
  return 'playlist';
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

export function youtubeEmbedUrl(
  videoId: string,
  opts?: { autoplay?: boolean; start?: number },
): string {
  const params = new URLSearchParams();
  params.set('enablejsapi', '1');
  params.set('origin', window.location.origin);
  if (opts?.autoplay) params.set('autoplay', '1');
  if (opts?.start != null && opts.start > 0) {
    params.set('start', String(Math.floor(opts.start)));
  }
  return `https://www.youtube.com/embed/${videoId}?${params}`;
}

export function youtubeEmbedUrlFromPersisted(
  url: string,
  opts?: { autoplay?: boolean },
): string {
  const id = activeYtId(url);
  if (!id) return url;
  const startMatch = url.match(/[?&]start=(\d+)/);
  const autoplay = opts?.autoplay ?? /[?&]autoplay=1/.test(url);
  return youtubeEmbedUrl(id, {
    autoplay,
    start: startMatch ? Number(startMatch[1]) : undefined,
  });
}
