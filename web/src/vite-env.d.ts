/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

interface Window {
  YT?: {
    Player: new (
      element: HTMLElement | string,
      options: {
        events?: {
          onReady?: (event: { target: YTPlayerInstance }) => void;
          onStateChange?: (event: {
            data: number;
            target: YTPlayerInstance;
          }) => void;
        };
      },
    ) => YTPlayerInstance;
  };
  onYouTubeIframeAPIReady?: () => void;
}
