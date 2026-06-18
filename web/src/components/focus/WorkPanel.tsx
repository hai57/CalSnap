import { useLang } from '@src/i18n';
import { useState } from 'react';
import { newId, usePersisted } from '@src/hooks/FocusHooks';
import { K, Link, PALETTE, Todo } from './constants';
import { DEFAULT_LINKS } from './constants';
import { Panel } from '@src/pages/StFocus';
import { CheckIcon, PlusIcon } from '../BaseIcons';
import { PomodoroTimer } from './PomodoroTimer';
import {
  WorkAdd,
  WorkBody,
  WorkBody2,
  WorkBrand,
  WorkCard,
  WorkCardCaption,
  WorkCardHead,
  WorkCardMeta,
  WorkCardTitle,
  WorkEmpty,
  WorkField,
  WorkGrid,
  WorkHero,
  WorkLinkDelete,
  WorkLinkGrid,
  WorkLinkLabel,
  WorkLinkMark,
  WorkLinkTile,
  WorkLogo,
  WorkNotes,
  WorkNotesWrap,
  WorkRow,
  WorkStage,
  WorkStatus,
  WorkSub,
  WorkTaskCheck,
  WorkTaskDelete,
  WorkTaskItem,
  WorkTaskList,
  WorkTaskText,
  WorkTimerHolder,
  WorkTitle,
} from './StWorkPanel';

export function WorkPanel() {
  const { t } = useLang();
  const [links, setLinks] = usePersisted<Link[]>(K('links'), DEFAULT_LINKS);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [todos, setTodos] = usePersisted<Todo[]>(K('todos'), []);
  const [todoInput, setTodoInput] = useState('');
  const [notes, setNotes] = usePersisted(K('notes'), '');

  const addLink = (e: React.FormEvent) => {
    e.preventDefault();
    const name = linkName.trim();
    let url = linkUrl.trim();
    if (!name || !url) return;
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    setLinks([...links, { name, url }]);
    setLinkName('');
    setLinkUrl('');
  };

  const removeLink = (index: number) =>
    setLinks(links.filter((_, i) => i !== index));

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const text = todoInput.trim();
    if (!text) return;
    setTodos([...todos, { id: newId(), text, done: false }]);
    setTodoInput('');
  };

  const toggleTodo = (id: string) =>
    setTodos(
      todos.map((td) => (td.id === id ? { ...td, done: !td.done } : td)),
    );

  const removeTodo = (id: string) =>
    setTodos(todos.filter((td) => td.id !== id));

  const doneCount = todos.filter((td) => td.done).length;

  return (
    <Panel>
      <WorkStage>
        <WorkHero>
          <WorkBrand>
            <WorkLogo aria-hidden="true">▣</WorkLogo>
            <div>
              <WorkTitle>{t('Work')}</WorkTitle>
              <WorkSub>{t('Plan, capture, focus, repeat.')}</WorkSub>
            </div>
          </WorkBrand>
          <WorkStatus>{t('In session')}</WorkStatus>
        </WorkHero>

        <WorkBody>
          <WorkGrid>
            <WorkCard $accent="rgba(108, 140, 255, 0.7)">
              <WorkCardHead>
                <div>
                  <WorkCardCaption $accent="#6c8cff">
                    {t('Quick links')}
                  </WorkCardCaption>
                  <WorkCardTitle>{t('Open in one tap')}</WorkCardTitle>
                </div>
              </WorkCardHead>

              <WorkRow onSubmit={addLink}>
                <WorkField
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                  placeholder={t('Name (e.g. Jira)')}
                  aria-label={t('Name (e.g. Jira)')}
                />
                <WorkField
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://…"
                  aria-label="https://…"
                />
                <WorkAdd type="submit" aria-label={t('Add')}>
                  <PlusIcon size={14} />
                </WorkAdd>
              </WorkRow>

              <WorkBody2>
                {links.length === 0 ? (
                  <WorkEmpty>
                    {t('No links yet — add your favourites above.')}
                  </WorkEmpty>
                ) : (
                  <WorkLinkGrid>
                    {links.map((l, i) => (
                      <WorkLinkTile
                        key={`${l.name}-${i}`}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        $color={PALETTE[i % PALETTE.length]}
                      >
                        <WorkLinkDelete
                          type="button"
                          aria-label={t('Remove')}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeLink(i);
                          }}
                        >
                          &times;
                        </WorkLinkDelete>
                        <WorkLinkMark $color={PALETTE[i % PALETTE.length]}>
                          {(l.name[0] || '?').toUpperCase()}
                        </WorkLinkMark>
                        <WorkLinkLabel>{l.name}</WorkLinkLabel>
                      </WorkLinkTile>
                    ))}
                  </WorkLinkGrid>
                )}
              </WorkBody2>
            </WorkCard>

            <WorkCard $accent="rgba(176, 108, 255, 0.7)">
              <WorkCardHead>
                <div>
                  <WorkCardCaption $accent="#b06cff">
                    {t('To-do')}
                  </WorkCardCaption>
                  <WorkCardTitle>{t("Today's list")}</WorkCardTitle>
                </div>
                {todos.length > 0 && (
                  <WorkCardMeta>
                    {doneCount}/{todos.length}
                  </WorkCardMeta>
                )}
              </WorkCardHead>

              <WorkRow onSubmit={addTodo}>
                <WorkField
                  value={todoInput}
                  onChange={(e) => setTodoInput(e.target.value)}
                  placeholder={t('What needs doing today?')}
                  aria-label={t('What needs doing today?')}
                />
                <WorkAdd type="submit" aria-label={t('Add')}>
                  <PlusIcon size={14} />
                </WorkAdd>
              </WorkRow>

              <WorkBody2>
                {todos.length === 0 ? (
                  <WorkEmpty>{t('All clear. Add a task above.')}</WorkEmpty>
                ) : (
                  <WorkTaskList>
                    {todos.map((td) => (
                      <WorkTaskItem key={td.id} $done={td.done}>
                        <WorkTaskCheck
                          type="button"
                          $done={td.done}
                          onClick={() => toggleTodo(td.id)}
                          aria-pressed={td.done}
                          aria-label={t('Toggle task')}
                        >
                          {td.done && <CheckIcon size={10} />}
                        </WorkTaskCheck>
                        <WorkTaskText $done={td.done}>{td.text}</WorkTaskText>
                        <WorkTaskDelete
                          type="button"
                          onClick={() => removeTodo(td.id)}
                          aria-label={t('Delete task')}
                        >
                          &times;
                        </WorkTaskDelete>
                      </WorkTaskItem>
                    ))}
                  </WorkTaskList>
                )}
              </WorkBody2>
            </WorkCard>
          </WorkGrid>

          <WorkCard $accent="rgba(29, 185, 84, 0.7)">
            <WorkCardHead>
              <div>
                <WorkCardCaption $accent="#1db954">
                  {t('Notes')}
                </WorkCardCaption>
                <WorkCardTitle>{t('Margin notes')}</WorkCardTitle>
              </div>
              <WorkCardMeta>{t('Saved locally')}</WorkCardMeta>
            </WorkCardHead>
            <WorkNotesWrap>
              <WorkNotes
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('Jot down anything — saved to this browser.')}
              />
            </WorkNotesWrap>
          </WorkCard>

          <WorkCard $accent="rgba(232, 168, 56, 0.8)">
            <WorkCardHead>
              <div>
                <WorkCardCaption>{t('Pomodoro')}</WorkCardCaption>
                <WorkCardTitle>{t('Focus timer')}</WorkCardTitle>
              </div>
              <WorkCardMeta>25 · 5 · 15</WorkCardMeta>
            </WorkCardHead>
            <WorkTimerHolder>
              <PomodoroTimer />
            </WorkTimerHolder>
          </WorkCard>
        </WorkBody>
      </WorkStage>
    </Panel>
  );
}
