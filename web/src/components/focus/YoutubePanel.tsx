import {
  activeYtId,
  resolveYtId,
  usePersisted,
  youtubeEmbedUrl,
  youtubeEmbedUrlFromPersisted,
} from '@src/hooks/FocusHooks';
import { useYouTubePlayer } from '@src/hooks/useYouTubePlayer';
import { useLang } from '@src/i18n';
import { useMemo, useRef } from 'react';
import { Panel } from '@src/pages/StFocus';
import { DEFAULT_YT, K, STATIONS } from './constants';
import {
  YoutubeBody,
  YoutubeBrand,
  YoutubeFoot,
  YoutubeHero,
  YoutubeLive,
  YoutubeLogo,
  YoutubePlayer,
  YoutubeStage,
  YoutubeStation,
  YoutubeStationDisc,
  YoutubeStationGrid,
  YoutubeStationLabel,
  YoutubeStationsHead,
  YoutubeStationsHint,
  YoutubeStationsTitle,
  YoutubeSub,
  YoutubeTitle,
} from './StYoutubePanel';

type YouTubePanelProps = {
  active?: boolean;
};

export function YouTubePanel({ active = true }: YouTubePanelProps) {
  const { t } = useLang();
  const [yt, setYt] = usePersisted(K('yt'), DEFAULT_YT);
  const activeYt = useMemo(() => {
    const id = activeYtId(yt);
    return id ? resolveYtId(id) : null;
  }, [yt]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const embedUrl = useMemo(() => youtubeEmbedUrlFromPersisted(yt), [yt]);

  useYouTubePlayer(iframeRef, active, embedUrl);

  return (
    <Panel>
      <YoutubeStage>
        <YoutubeHero>
          <YoutubeBrand>
            <YoutubeLogo aria-hidden="true">▶</YoutubeLogo>
            <div>
              <YoutubeTitle>{t('YouTube')}</YoutubeTitle>
              <YoutubeSub>
                {t('Lo-fi rooms, focus mixes, ambient streams.')}
              </YoutubeSub>
            </div>
          </YoutubeBrand>
          <YoutubeLive>{t('On Air')}</YoutubeLive>
        </YoutubeHero>

        <YoutubeBody>
          <YoutubePlayer>
            <iframe
              ref={iframeRef}
              key={embedUrl}
              src={embedUrl}
              title="YouTube"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </YoutubePlayer>

          <YoutubeStationsHead>
            <YoutubeStationsTitle>{t('Stations')}</YoutubeStationsTitle>
            <YoutubeStationsHint>
              {t('{count} channels', { count: STATIONS.length })}
            </YoutubeStationsHint>
          </YoutubeStationsHead>

          <YoutubeStationGrid>
            {STATIONS.map((s) => (
              <YoutubeStation
                key={s.lbl}
                type="button"
                $color={s.c}
                $active={activeYt === s.yt}
                onClick={() => setYt(youtubeEmbedUrl(s.yt, { autoplay: true }))}
              >
                <YoutubeStationDisc $color={s.c} aria-hidden="true">
                  {'\u266A'}
                </YoutubeStationDisc>
                <YoutubeStationLabel>{s.lbl}</YoutubeStationLabel>
              </YoutubeStation>
            ))}
          </YoutubeStationGrid>

          <YoutubeFoot>
            {t('Tip: pick a station above to start the stream.')}
          </YoutubeFoot>
        </YoutubeBody>
      </YoutubeStage>
    </Panel>
  );
}
