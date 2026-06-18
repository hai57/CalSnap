import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  DEFAULT_SPOTIFY,
  K,
  SPOTIFY_PRESETS,
} from '@shared/focus/constants';
import {
  activeSpotifyPlaylist,
  spotifyEmbed,
  spotifyFrameSize,
  spotifyPlaylistEmbed,
  usePersisted,
} from '../hooks/focusHooks';
import { useLang } from '../i18n';
import { colors } from '../theme';
import { EmbedFrame, InlineField, Panel, SectionHeader } from './ui';

export function SpotifyPanel() {
  const { t } = useLang();
  const [spotify, setSpotify] = usePersisted(K('spotify'), DEFAULT_SPOTIFY);
  const [spotifyInput, setSpotifyInput] = useState('');
  const [spotifyError, setSpotifyError] = useState(false);
  const activePlaylist = activeSpotifyPlaylist(spotify);
  const frameSize = spotifyFrameSize(spotify);
  const height =
    frameSize === 'compact' ? 152 : frameSize === 'album' ? 352 : 380;

  const loadSpotify = () => {
    const src = spotifyEmbed(spotifyInput.trim());
    if (!src) {
      setSpotifyError(true);
      return;
    }
    setSpotifyError(false);
    setSpotify(src);
    setSpotifyInput('');
  };

  return (
    <Panel accent="#1db954">
      <SectionHeader
        title={t('Spotify')}
        badge={t('Now playing')}
        accent="#1db954"
      />
      <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {SPOTIFY_PRESETS.map((p) => (
            <Pressable
              key={p.playlist}
              onPress={() => {
                setSpotifyError(false);
                setSpotify(spotifyPlaylistEmbed(p.playlist));
              }}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor:
                  activePlaylist === p.playlist ? '#1db954' : colors.bg,
                borderWidth: 1,
                borderColor:
                  activePlaylist === p.playlist ? '#1db954' : colors.border,
              }}
            >
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 12,
                  color: activePlaylist === p.playlist ? '#fff' : colors.text,
                }}
              >
                {t(p.label)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <InlineField
            value={spotifyInput}
            onChangeText={(v) => {
              setSpotifyInput(v);
              setSpotifyError(false);
            }}
            placeholder={t('Paste a Spotify track / playlist / album link')}
            autoCapitalize="none"
          />
          <Pressable
            onPress={loadSpotify}
            style={{
              paddingHorizontal: 14,
              borderRadius: 10,
              backgroundColor: '#1db954',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700' }}>{t('Load')}</Text>
          </Pressable>
        </View>

        {spotifyError ? (
          <Text style={{ color: colors.danger, fontSize: 12 }}>
            {t('Paste a valid Spotify track / playlist / album link.')}
          </Text>
        ) : null}

        <EmbedFrame uri={spotify} height={height} />

        <Text style={{ fontSize: 12, color: colors.muted }}>
          {t('Tip: Spotify → Share → Copy link, then paste above.')}
        </Text>
      </View>
    </Panel>
  );
}
