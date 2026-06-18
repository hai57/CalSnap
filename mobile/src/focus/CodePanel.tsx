import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';

import { CODE_SHORTCUTS, DEV_ENGINES, K } from '@shared/focus/constants';
import { usePersisted } from '../hooks/focusHooks';
import { useLang } from '../i18n';
import { colors } from '../theme';
import { InlineField, Panel, Pill, SectionHeader } from './ui';

export function CodingPanel() {
  const { t } = useLang();
  const [soQuery, setSoQuery] = useState('');
  const [devEngine, setDevEngine] = usePersisted(K('devEngine'), 'github');
  const [devQuery, setDevQuery] = useState('');
  const [snippets, setSnippets] = usePersisted(K('snippets'), '');

  const soGo = () => {
    const q = soQuery.trim();
    if (!q) return;
    void Linking.openURL(
      `https://stackoverflow.com/search?q=${encodeURIComponent(q)}`,
    );
  };

  const devGo = () => {
    const q = devQuery.trim();
    if (!q) return;
    const en = DEV_ENGINES.find((x) => x.id === devEngine) ?? DEV_ENGINES[0];
    void Linking.openURL(en.url(encodeURIComponent(q)));
  };

  return (
    <Panel accent="#512bd4">
      <SectionHeader
        title={t('Coding')}
        subtitle="~/focus › search · ref · snippet"
        badge={t('Ready')}
        accent="#512bd4"
      />
      <View style={{ padding: 16, paddingTop: 0, gap: 16 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {CODE_SHORTCUTS.map((s) => (
            <Pressable
              key={s.lbl}
              onPress={() => void Linking.openURL(s.url)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: `${s.c}18`,
                borderWidth: 1,
                borderColor: `${s.c}44`,
              }}
            >
              <Text style={{ fontWeight: '700', color: colors.text }}>{s.lbl}</Text>
            </Pressable>
          ))}
        </View>

        <View>
          <Text style={{ fontWeight: '700', color: colors.text, marginBottom: 8 }}>
            {t('Stack Overflow')}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <InlineField
              value={soQuery}
              onChangeText={setSoQuery}
              placeholder={t('e.g. dependency injection scope')}
              onSubmitEditing={soGo}
            />
            <Pressable
              onPress={soGo}
              style={{
                paddingHorizontal: 14,
                borderRadius: 10,
                backgroundColor: colors.brand,
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>{t('Go')}</Text>
            </Pressable>
          </View>
        </View>

        <View>
          <Text style={{ fontWeight: '700', color: colors.text, marginBottom: 8 }}>
            {t('Dev quick-search')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
            {DEV_ENGINES.map((en) => (
              <Pill
                key={en.id}
                label={en.label}
                active={en.id === devEngine}
                onPress={() => setDevEngine(en.id)}
              />
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <InlineField
              value={devQuery}
              onChangeText={setDevQuery}
              placeholder={t('Search query…')}
              onSubmitEditing={devGo}
            />
            <Pressable
              onPress={devGo}
              style={{
                paddingHorizontal: 14,
                borderRadius: 10,
                backgroundColor: colors.brand,
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>{t('Go')}</Text>
            </Pressable>
          </View>
        </View>

        <View>
          <Text style={{ fontWeight: '700', color: colors.text, marginBottom: 8 }}>
            {t('Snippet scratchpad')}
          </Text>
          <InlineField
            value={snippets}
            onChangeText={setSnippets}
            placeholder={t('Stash code snippets, commands, regexes…')}
            multiline
            style={{ minHeight: 120, textAlignVertical: 'top', fontFamily: 'monospace' }}
          />
        </View>
      </View>
    </Panel>
  );
}
