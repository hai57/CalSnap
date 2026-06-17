import { usePersisted } from '@src/hooks/FocusHooks';
import { useLang } from '@src/i18n';
import { useState } from 'react';
import { CODE_SHORTCUTS, DEV_ENGINES, K } from './constants';
import {
  ActionBtn,
  Card,
  CardBody,
  CardDot,
  CardHead,
  CardTitle,
  Grid,
  Hint,
  InsetField,
  Notes,
  Panel,
  Select,
  Shortcut,
  ShortcutGrid,
  ShortcutLabel,
  ShortcutMark,
} from '@src/pages/StFocus';
import { Row } from '@src/pages/StDashboard';
import { SearchIcon } from '../BaseIcons';

export function CodingPanel() {
  const { t } = useLang();
  const [soQuery, setSoQuery] = useState('');
  const [devEngine, setDevEngine] = usePersisted(K('devEngine'), 'github');
  const [devQuery, setDevQuery] = useState('');
  const [snippets, setSnippets] = usePersisted(K('snippets'), '');

  const soGo = (e: React.FormEvent) => {
    e.preventDefault();
    const q = soQuery.trim();
    if (!q) return;
    window.open(
      `https://stackoverflow.com/search?q=${encodeURIComponent(q)}`,
      '_blank',
      'noopener',
    );
  };

  const devGo = (e: React.FormEvent) => {
    e.preventDefault();
    const q = devQuery.trim();
    if (!q) return;
    const en = DEV_ENGINES.find((x) => x.id === devEngine) ?? DEV_ENGINES[0];
    window.open(en.url(encodeURIComponent(q)), '_blank', 'noopener');
  };

  return (
    <Panel>
      <Grid>
        <Card>
          <CardHead>
            <CardDot $color="#f48024" />
            <CardTitle>{t('Stack Overflow search')}</CardTitle>
          </CardHead>
          <Row onSubmit={soGo}>
            <InsetField
              value={soQuery}
              onChange={(e) => setSoQuery(e.target.value)}
              placeholder={t('e.g. dependency injection scope')}
              aria-label={t('Stack Overflow search')}
            />
            <ActionBtn type="submit" aria-label={t('Search')}>
              <SearchIcon size={16} />
            </ActionBtn>
          </Row>
          <CardBody>
            <ShortcutGrid>
              {CODE_SHORTCUTS.map((s) => (
                <Shortcut
                  key={s.lbl}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  $color={s.c}
                >
                  <ShortcutMark $color={s.c}>{s.lbl[0]}</ShortcutMark>
                  <ShortcutLabel>{s.lbl}</ShortcutLabel>
                </Shortcut>
              ))}
            </ShortcutGrid>
          </CardBody>
          <Hint>
            {t("Opens in a new tab (these sites can't be embedded).")}
          </Hint>
        </Card>

        <Card>
          <CardHead>
            <CardDot $color="#b06cff" />
            <CardTitle>{t('Dev quick-search')}</CardTitle>
          </CardHead>
          <Row onSubmit={devGo}>
            <Select
              value={devEngine}
              onChange={(e) => setDevEngine(e.target.value)}
              aria-label={t('Search source')}
            >
              {DEV_ENGINES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </Select>
            <InsetField
              value={devQuery}
              onChange={(e) => setDevQuery(e.target.value)}
              placeholder={t('Search query…')}
              aria-label={t('Search query…')}
            />
            <ActionBtn type="submit">{t('Go')}</ActionBtn>
          </Row>

          <CardHead style={{ marginTop: '0.5rem' }}>
            <CardDot $color="#1db954" />
            <CardTitle>{t('Snippet scratchpad')}</CardTitle>
          </CardHead>
          <CardBody>
            <Notes
              value={snippets}
              onChange={(e) => setSnippets(e.target.value)}
              placeholder={t('Stash code snippets, commands, regexes…')}
            />
          </CardBody>
          <Hint>{t('Saved locally')}</Hint>
        </Card>
      </Grid>
    </Panel>
  );
}
