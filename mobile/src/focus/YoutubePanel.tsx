import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { DEFAULT_YT, K, STATIONS } from '@shared/focus/constants';
import {
  activeYtId,
  resolveYtId,
  usePersisted,
  youtubeEmbedUrl,
  youtubeEmbedUrlFromPersisted,
} from '../hooks/focusHooks';
import { useLang } from '../i18n';
import { colors } from '../theme';
import { EmbedFrame, Panel, SectionHeader } from './ui';

type YoutubePanelProps = {
  active?: boolean;
};

export function YoutubePanel({ active = true }: YoutubePanelProps) {
  const { t } = useLang();
  const [yt, setYt] = usePersisted(K('yt'), DEFAULT_YT);
  const activeYt = useMemo(() => {
    const id = activeYtId(yt);
    return id ? resolveYtId(id) : null;
  }, [yt]);
  const embedUrl = useMemo(
    () => youtubeEmbedUrlFromPersisted(yt, { autoplay: true }),
    [yt],
  );

  if (!active) return null;

  return (
    <Panel accent="#ff5e7e">
      <SectionHeader
        title={t('YouTube')}
        subtitle={t('Lo-fi rooms, focus mixes, ambient streams.')}
        badge={t('On Air')}
        accent="#ff5e7e"
      />
      <View style={{ padding: 16, paddingTop: 0, gap: 12 }}>
        <EmbedFrame uri={embedUrl} height={220} />

        <Text style={{ fontWeight: '700', color: colors.text }}>{t('Stations')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {STATIONS.map((s) => (
            <Pressable
              key={s.lbl}
              onPress={() => setYt(youtubeEmbedUrl(s.yt, { autoplay: true }))}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: activeYt === s.yt ? `${s.c}22` : colors.bg,
                borderWidth: 1,
                borderColor: activeYt === s.yt ? s.c : colors.border,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: s.c,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 10 }}>♪</Text>
              </View>
              <Text style={{ fontWeight: '600', color: colors.text }}>{s.lbl}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={{ fontSize: 12, color: colors.muted }}>
          {t('Tip: pick a station above to start the stream.')}
        </Text>
      </View>
    </Panel>
  );
}
