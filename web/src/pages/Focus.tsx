import { useState } from 'react';

import { SearchIcon } from '../components/BaseIcons';
import { useLang } from '../i18n';
import {
  ActionBtn,
  DisplayTitle,
  Eyebrow,
  Field,
  ModeNav,
  ModeTab,
  PanelSlot,
  PanelStage,
  Pill,
  PillRow,
  SearchForm,
  Shell,
  Toolbar,
  TopBar,
  TopBarCopy,
} from './StFocus';
import { ENGINES, K, TAB_ICONS, TabId } from '@src/components/focus/constants';
import { readTab, usePersisted } from '@src/hooks/FocusHooks';
import { Clock } from '@src/components/focus/Clock';
import { SpotifyPanel } from '@src/components/focus/SpotifyPanel';
import { YouTubePanel } from '@src/components/focus/YoutubePanel';
import { CodingPanel } from '@src/components/focus/CodePanel';
import { WorkPanel } from '@src/components/focus/WorkPanel';

export function Focus() {
  const { t } = useLang();
  const [tab, setTabState] = useState<TabId>(readTab);
  const setTab = (next: TabId) => {
    setTabState(next);
    try {
      window.localStorage.setItem(K('tab'), JSON.stringify(next));
    } catch {
      // ignore storage failures
    }
  };
  const [engine, setEngine] = usePersisted(K('engine'), 'google');
  const [query, setQuery] = useState('');

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    const en = ENGINES.find((x) => x.id === engine) ?? ENGINES[0];
    window.open(en.url(encodeURIComponent(q)), '_blank', 'noopener');
    setQuery('');
  };

  const TABS: { id: TabId; label: string }[] = [
    { id: 'work', label: 'Work' },
    { id: 'spotify', label: 'Spotify' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'coding', label: 'Coding' },
  ];

  return (
    <Shell>
      <TopBar>
        <TopBarCopy>
          <Eyebrow>{t('Focus')}</Eyebrow>
          <DisplayTitle>{t('Your sanctuary.')}</DisplayTitle>
        </TopBarCopy>
        <Clock />
      </TopBar>

      <Toolbar>
        <SearchForm onSubmit={runSearch}>
          <Field
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('Search the web, code, or videos…')}
            aria-label={t('Search')}
          />
          <ActionBtn type="submit" aria-label={t('Search')}>
            <SearchIcon size={16} />
          </ActionBtn>
        </SearchForm>
        <PillRow>
          {ENGINES.map((en) => (
            <Pill
              key={en.id}
              type="button"
              $active={engine === en.id}
              onClick={() => setEngine(en.id)}
            >
              {en.label}
            </Pill>
          ))}
        </PillRow>
        <ModeNav role="tablist" aria-label={t('Focus')}>
          {TABS.map((tb) => (
            <ModeTab
              key={tb.id}
              type="button"
              role="tab"
              aria-selected={tab === tb.id}
              $active={tab === tb.id}
              onClick={() => setTab(tb.id)}
            >
              <span className="icon" aria-hidden="true">
                {TAB_ICONS[tb.id]}
              </span>
              {t(tb.label)}
            </ModeTab>
          ))}
        </ModeNav>
      </Toolbar>

      <PanelStage>
        <PanelSlot $active={tab === 'work'} aria-hidden={tab !== 'work'}>
          <WorkPanel />
        </PanelSlot>
        <PanelSlot $active={tab === 'spotify'} aria-hidden={tab !== 'spotify'}>
          <SpotifyPanel />
        </PanelSlot>
        <PanelSlot $active={tab === 'youtube'} aria-hidden={tab !== 'youtube'}>
          <YouTubePanel active={tab === 'youtube'} />
        </PanelSlot>
        <PanelSlot $active={tab === 'coding'} aria-hidden={tab !== 'coding'}>
          <CodingPanel />
        </PanelSlot>
      </PanelStage>
    </Shell>
  );
}
