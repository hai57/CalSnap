import { usePersisted } from '@src/hooks/FocusHooks';
import { useLang } from '@src/i18n';
import { useState } from 'react';
import { CODE_SHORTCUTS, DEV_ENGINES, K } from './constants';
import { Panel } from '@src/pages/StFocus';
import {
  CodeBlock,
  CodeBlockHead,
  CodeBlockTitle,
  CodeBody,
  CodeBrand,
  CodeHero,
  CodeHint,
  CodeLogo,
  CodePrompt,
  CodePromptBtn,
  CodePromptCaret,
  CodePromptField,
  CodePromptSelect,
  CodeShortcut,
  CodeShortcutLabel,
  CodeShortcutMark,
  CodeShortcuts,
  CodeSnippet,
  CodeSnippetBar,
  CodeSnippetWrap,
  CodeStage,
  CodeStatus,
  CodeSub,
  CodeTitle,
} from './StCodePanel';

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
      <CodeStage>
        <CodeHero>
          <CodeBrand>
            <CodeLogo aria-hidden="true">{'</>'}</CodeLogo>
            <div>
              <CodeTitle>{t('Coding')}</CodeTitle>
              <CodeSub>~/focus › search · ref · snippet</CodeSub>
            </div>
          </CodeBrand>
          <CodeStatus>{t('Ready')}</CodeStatus>
        </CodeHero>

        <CodeBody>
          <CodeBlock>
            <div>
              <CodeBlockHead>{t('Stack Overflow')}</CodeBlockHead>
              <CodeBlockTitle>{t('Search the swarm')}</CodeBlockTitle>
            </div>

            <CodePrompt onSubmit={soGo}>
              <CodePromptCaret>$</CodePromptCaret>
              <CodePromptField
                value={soQuery}
                onChange={(e) => setSoQuery(e.target.value)}
                placeholder={t('e.g. dependency injection scope')}
                aria-label={t('Stack Overflow search')}
              />
              <CodePromptBtn type="submit">{t('Run')}</CodePromptBtn>
            </CodePrompt>

            <CodeShortcuts>
              {CODE_SHORTCUTS.map((s) => (
                <CodeShortcut
                  key={s.lbl}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  $color={s.c}
                >
                  <CodeShortcutMark $color={s.c}>{s.lbl[0]}</CodeShortcutMark>
                  <CodeShortcutLabel>{s.lbl}</CodeShortcutLabel>
                </CodeShortcut>
              ))}
            </CodeShortcuts>

            <CodeHint>
              {t('// opens in new tab — some sites refuse embed')}
            </CodeHint>
          </CodeBlock>

          <CodeBlock>
            <div>
              <CodeBlockHead>{t('Dev quick-search')}</CodeBlockHead>
              <CodeBlockTitle>{t('Jump to docs')}</CodeBlockTitle>
            </div>

            <CodePrompt onSubmit={devGo}>
              <CodePromptSelect
                value={devEngine}
                onChange={(e) => setDevEngine(e.target.value)}
                aria-label={t('Search source')}
              >
                {DEV_ENGINES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </CodePromptSelect>
              <CodePromptField
                value={devQuery}
                onChange={(e) => setDevQuery(e.target.value)}
                placeholder={t('Search query…')}
                aria-label={t('Search query…')}
              />
              <CodePromptBtn type="submit">{t('Go')}</CodePromptBtn>
            </CodePrompt>

            <div>
              <CodeBlockHead>{t('Snippet scratchpad')}</CodeBlockHead>
              <CodeBlockTitle>{t('Stash anything')}</CodeBlockTitle>
            </div>

            <CodeSnippetWrap>
              <CodeSnippetBar>
                <span className="dot r" />
                <span className="dot y" />
                <span className="dot g" />
                ~/snippets.md
                <small>{t('local')}</small>
              </CodeSnippetBar>
              <CodeSnippet
                value={snippets}
                onChange={(e) => setSnippets(e.target.value)}
                placeholder={t('// commands, regexes, one-liners…')}
                spellCheck={false}
              />
            </CodeSnippetWrap>
          </CodeBlock>
        </CodeBody>
      </CodeStage>
    </Panel>
  );
}
