import { useState } from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';

import { ENGINES, K, TAB_ICONS, type TabId } from '@shared/focus/constants';
import { usePersisted } from '../hooks/focusHooks';
import { useLang } from '../i18n';
import { colors } from '../theme';
import { CodingPanel } from '../focus/CodePanel';
import { SpotifyPanel } from '../focus/SpotifyPanel';
import { WorkPanel } from '../focus/WorkPanel';
import { YoutubePanel } from '../focus/YoutubePanel';
import { InlineField, TabRow } from '../focus/ui';

function Clock() {
  const { t } = useLang();
  const now = new Date();
  const h = now.getHours();
  const greeting =
    h < 12
      ? t('Good morning')
      : h < 17
        ? t('Good afternoon')
        : t('Good evening');
  return (
    <Text style={{ fontSize: 13, color: colors.muted, fontWeight: '600' }}>
      {greeting}
    </Text>
  );
}

export function FocusScreen() {
  const { t } = useLang();
  const [tab, setTab] = usePersisted<TabId>(K('tab'), 'work');
  const [engine, setEngine] = usePersisted(K('engine'), 'google');
  const [query, setQuery] = useState('');

  const runSearch = () => {
    const q = query.trim();
    if (!q) return;
    const en = ENGINES.find((x) => x.id === engine) ?? ENGINES[0];
    void Linking.openURL(en.url(encodeURIComponent(q)));
    setQuery('');
  };

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'work', label: t('Work'), icon: TAB_ICONS.work },
    { id: 'spotify', label: t('Spotify'), icon: TAB_ICONS.spotify },
    { id: 'youtube', label: t('YouTube'), icon: TAB_ICONS.youtube },
    { id: 'coding', label: t('Coding'), icon: TAB_ICONS.coding },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text
          style={{
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: colors.brand,
          }}
        >
          {t('Focus')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: 4,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>
            {t('Your sanctuary.')}
          </Text>
          <Clock />
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 12, gap: 8 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <InlineField
            value={query}
            onChangeText={setQuery}
            placeholder={t('Search the web, code, or videos…')}
            onSubmitEditing={runSearch}
          />
          <View style={{ justifyContent: 'center' }}>
            <Text
              onPress={runSearch}
              style={{
                color: colors.brand,
                fontWeight: '800',
                paddingHorizontal: 8,
              }}
            >
              {t('Search')}
            </Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {ENGINES.map((en) => (
              <Text
                key={en.id}
                onPress={() => setEngine(en.id)}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                  overflow: 'hidden',
                  fontWeight: '700',
                  fontSize: 12,
                  color: engine === en.id ? '#fff' : colors.text,
                  backgroundColor: engine === en.id ? colors.brand : colors.card,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                {en.label}
              </Text>
            ))}
          </View>
        </ScrollView>
      </View>

      <TabRow tabs={tabs} active={tab} onChange={setTab} />

      <View style={{ paddingHorizontal: 16, paddingTop: 4, gap: 12 }}>
        {tab === 'work' ? <WorkPanel /> : null}
        {tab === 'spotify' ? <SpotifyPanel /> : null}
        {tab === 'youtube' ? <YoutubePanel active /> : null}
        {tab === 'coding' ? <CodingPanel /> : null}
      </View>
    </ScrollView>
  );
}
