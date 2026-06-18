import { K, VALID_TABS, type TabId } from '@src/components/focus/constants';
import { useState } from 'react';
import {
  youtubeEmbedUrlFromPersisted as youtubeEmbedUrlFromPersistedBase,
} from '@shared/focus/media';

export {
  activeSpotifyPlaylist,
  activeYtId,
  newId,
  resolveYtId,
  spotifyEmbed,
  spotifyPlaylistEmbed,
  youtubeEmbedUrl,
} from '@shared/focus/media';

export function spotifyFrameSize(
  url: string,
): 'compact' | 'album' | 'playlist' {
  if (/embed\/(track|episode)\//.test(url)) return 'compact';
  if (/embed\/(album|artist)\//.test(url)) return 'album';
  return 'playlist';
}

export function youtubeEmbedUrlFromPersisted(
  url: string,
  opts?: { autoplay?: boolean },
): string {
  return youtubeEmbedUrlFromPersistedBase(url, {
    ...opts,
    origin: window.location.origin,
  });
}

export function readTab(): TabId {
  try {
    const raw = window.localStorage.getItem(K('tab'));
    if (raw == null) return 'work';
    const v = JSON.parse(raw) as string;
    if (v === 'music') return 'spotify';
    return VALID_TABS.includes(v as TabId) ? (v as TabId) : 'work';
  } catch {
    return 'work';
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
