import { type RefObject, useEffect, useRef } from 'react';

const YT_PLAYING = 1;

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  destroy: () => void;
};

let ytApiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });

  return ytApiPromise;
}

export function useYouTubePlayer(
  iframeRef: RefObject<HTMLIFrameElement | null>,
  active: boolean,
  embedUrl: string,
) {
  const playerRef = useRef<YTPlayer | null>(null);
  const wasPlayingRef = useRef(false);
  const readyRef = useRef(false);
  const activeRef = useRef(active);

  activeRef.current = active;

  useEffect(() => {
    const el = iframeRef.current;
    if (!el) return;

    let cancelled = false;
    let player: YTPlayer | null = null;
    readyRef.current = false;

    void (async () => {
      await loadYouTubeApi();
      if (cancelled || !iframeRef.current) return;

      player = new window.YT!.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            if (cancelled) return;
            playerRef.current = event.target;
            readyRef.current = true;

            if (!activeRef.current) {
              if (
                wasPlayingRef.current ||
                /[?&]autoplay=1/.test(embedUrl) ||
                event.target.getPlayerState() === YT_PLAYING
              ) {
                wasPlayingRef.current = true;
              }
              event.target.pauseVideo();
            } else if (wasPlayingRef.current) {
              event.target.playVideo();
            }
          },
          onStateChange: (event) => {
            wasPlayingRef.current = event.data === YT_PLAYING;
          },
        },
      });
    })();

    return () => {
      cancelled = true;
      readyRef.current = false;
      player?.destroy();
      playerRef.current = null;
    };
  }, [embedUrl, iframeRef]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player || !readyRef.current) return;

    if (!active) {
      wasPlayingRef.current = player.getPlayerState() === YT_PLAYING;
      player.pauseVideo();
      return;
    }

    if (wasPlayingRef.current) {
      player.playVideo();
    }
  }, [active]);
}
