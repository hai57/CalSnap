import {
  activeYtId,
  usePersisted,
  youtubeEmbedUrl,
  youtubeEmbedUrlFromPersisted,
} from '@src/hooks/FocusHooks';
import { useYouTubePlayer } from '@src/hooks/useYouTubePlayer';
import { useLang } from '@src/i18n';
import { useMemo, useRef } from 'react';
import {
  Card,
  CardDot,
  CardHead,
  CardTitle,
  Hint,
  MediaFrame,
  MediaShell,
  Panel,
  Station,
  StationDisc,
  StationGrid,
  StationLabel,
} from '@src/pages/StFocus';
import { DEFAULT_YT, K, STATIONS } from './constants';

type YouTubePanelProps = {
  active?: boolean;
};

export function YouTubePanel({ active = true }: YouTubePanelProps) {
  const { t } = useLang();
  const [yt, setYt] = usePersisted(K('yt'), DEFAULT_YT);
  const activeYt = activeYtId(yt);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const embedUrl = useMemo(() => youtubeEmbedUrlFromPersisted(yt), [yt]);

  useYouTubePlayer(iframeRef, active, embedUrl);

  return (
    <Panel>
      <Card>
        <CardHead>
          <CardDot $color="#ff4b4b" />
          <CardTitle>YouTube</CardTitle>
        </CardHead>
        <MediaShell $provider="youtube">
          <MediaFrame $provider="youtube">
            <iframe
              ref={iframeRef}
              key={embedUrl}
              src={embedUrl}
              title="YouTube"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </MediaFrame>
        </MediaShell>
        <Hint>{t('Pick a station below to start the stream.')}</Hint>
      </Card>

      <Card>
        <CardHead>
          <CardDot $color="#e8a838" />
          <CardTitle>{t('Quick stations')}</CardTitle>
        </CardHead>
        <StationGrid>
          {STATIONS.map((s) => (
            <Station
              key={s.lbl}
              type="button"
              $color={s.c}
              $active={activeYt === s.yt}
              onClick={() => setYt(youtubeEmbedUrl(s.yt, { autoplay: true }))}
            >
              <StationDisc $color={s.c} aria-hidden="true">
                {'\u266A'}
              </StationDisc>
              <StationLabel>{s.lbl}</StationLabel>
            </Station>
          ))}
        </StationGrid>
      </Card>
    </Panel>
  );
}
