import { useLang } from '@src/i18n';
import {
  activeSpotifyPlaylist,
  spotifyEmbed,
  spotifyFrameSize,
  spotifyPlaylistEmbed,
  usePersisted,
} from '@src/hooks/FocusHooks';
import { useState } from 'react';
import { DEFAULT_SPOTIFY, K, SPOTIFY_PRESETS } from './constants';
import {
  SpotifyBody,
  SpotifyBrand,
  SpotifyField,
  SpotifyFoot,
  SpotifyHero,
  SpotifyLoad,
  SpotifyLoadBtn,
  SpotifyNow,
  SpotifyPlayer,
  SpotifyPlayerShade,
  SpotifyPreset,
  SpotifyPresets,
  SpotifyStage,
} from './StSpotifyPanel';
import { CardDot, CardTitle, HintError, Panel } from '@src/pages/StFocus';

export function SpotifyPanel() {
  const { t } = useLang();
  const [spotify, setSpotify] = usePersisted(K('spotify'), DEFAULT_SPOTIFY);
  const [spotifyInput, setSpotifyInput] = useState('');
  const [spotifyError, setSpotifyError] = useState(false);
  const [playerReady, setPlayerReady] = useState(true);
  const activePlaylist = activeSpotifyPlaylist(spotify);
  const frameSize = spotifyFrameSize(spotify);

  const setPlayer = (src: string) => {
    setPlayerReady(false);
    setSpotify(src);
  };

  const loadSpotify = (e: React.FormEvent) => {
    e.preventDefault();
    const src = spotifyEmbed(spotifyInput.trim());
    if (!src) {
      setSpotifyError(true);
      return;
    }
    setSpotifyError(false);
    setPlayer(src);
    setSpotifyInput('');
  };

  const pickPreset = (playlist: string) => {
    setSpotifyError(false);
    setPlayer(spotifyPlaylistEmbed(playlist));
  };

  return (
    <Panel>
      <SpotifyStage>
        <SpotifyHero>
          <SpotifyBrand>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
              }}
            >
              <CardDot $color="#169c46" />
              <CardTitle>{t('Spotify')}</CardTitle>
            </div>
          </SpotifyBrand>
          <SpotifyNow>{t('Now playing')}</SpotifyNow>
        </SpotifyHero>

        <SpotifyBody>
          <SpotifyPresets>
            {SPOTIFY_PRESETS.map((p) => (
              <SpotifyPreset
                key={p.playlist}
                type="button"
                $active={activePlaylist === p.playlist}
                onClick={() => pickPreset(p.playlist)}
              >
                {t(p.label)}
              </SpotifyPreset>
            ))}
          </SpotifyPresets>

          <SpotifyLoad onSubmit={loadSpotify}>
            <SpotifyField
              value={spotifyInput}
              onChange={(e) => {
                setSpotifyInput(e.target.value);
                setSpotifyError(false);
              }}
              placeholder={t('Paste a Spotify track / playlist / album link')}
              aria-label={t('Paste a Spotify track / playlist / album link')}
            />
            <SpotifyLoadBtn type="submit">{t('Load')}</SpotifyLoadBtn>
          </SpotifyLoad>

          {spotifyError && (
            <HintError>
              {t('Paste a valid Spotify track / playlist / album link.')}
            </HintError>
          )}

          <SpotifyPlayer $size={frameSize}>
            <SpotifyPlayerShade $show={!playerReady} aria-hidden="true" />
            <iframe
              src={spotify}
              title="Spotify"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              onLoad={() => setPlayerReady(true)}
            />
          </SpotifyPlayer>

          <SpotifyFoot>
            {t('Tip: Spotify → Share → Copy link, then paste above.')}
          </SpotifyFoot>
        </SpotifyBody>
      </SpotifyStage>
    </Panel>
  );
}
