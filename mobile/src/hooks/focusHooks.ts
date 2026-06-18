import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { K, VALID_TABS, type TabId } from '@shared/focus/constants';

export {
  activeSpotifyPlaylist,
  activeYtId,
  newId,
  resolveYtId,
  spotifyEmbed,
  spotifyPlaylistEmbed,
  youtubeEmbedUrl,
  youtubeEmbedUrlFromPersisted,
} from '@shared/focus/media';

export function spotifyFrameSize(
  url: string,
): 'compact' | 'album' | 'playlist' {
  if (/embed\/(track|episode)\//.test(url)) return 'compact';
  if (/embed\/(album|artist)\//.test(url)) return 'album';
  return 'playlist';
}

export function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void AsyncStorage.getItem(key).then((raw) => {
      if (cancelled) return;
      if (raw != null) {
        try {
          setValue(JSON.parse(raw) as T);
        } catch {
          // ignore corrupt storage
        }
      }
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const update = useCallback(
    (next: T) => {
      setValue(next);
      void AsyncStorage.setItem(key, JSON.stringify(next));
    },
    [key],
  );

  return [value, update, hydrated] as const;
}

export function usePersistedTab(initial: TabId = 'work') {
  const [tab, setTab, hydrated] = usePersisted<TabId>(K('tab'), initial);
  const setValidTab = useCallback(
    (next: TabId) => {
      if (VALID_TABS.includes(next)) setTab(next);
    },
    [setTab],
  );
  return [tab, setValidTab, hydrated] as const;
}
