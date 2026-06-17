import { useLang } from '@src/i18n';
import { useState } from 'react';
import { newId, usePersisted } from '@src/hooks/FocusHooks';
import { K, Link, PALETTE, Todo } from './constants';
import { DEFAULT_LINKS } from './constants';
import {
  ActionBtn,
  Card,
  CardBadge,
  CardBody,
  CardDot,
  CardHead,
  CardTitle,
  Empty,
  Grid,
  Hint,
  InsetField,
  LinkDelete,
  LinkGrid,
  LinkTile,
  Notes,
  Panel,
  Row,
  ShortcutLabel,
  ShortcutMark,
  TaskCheck,
  TaskDelete,
  TaskItem,
  TaskList,
  TaskText,
} from '@src/pages/StFocus';
import { CheckIcon, PlusIcon } from '../BaseIcons';
import { PomodoroTimer } from './PomodoroTimer';

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
      <Grid>
        <Card>
          <CardHead>
            <CardDot $color="#6c8cff" />
            <CardTitle>{t('Quick links')}</CardTitle>
          </CardHead>
          <Row onSubmit={addLink}>
            <InsetField
              value={linkName}
              onChange={(e) => setLinkName(e.target.value)}
              placeholder={t('Name (e.g. Jira)')}
              aria-label={t('Name (e.g. Jira)')}
            />
            <InsetField
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://…"
              aria-label="https://…"
            />
            <ActionBtn type="submit" aria-label={t('Add')}>
              <PlusIcon size={16} />
            </ActionBtn>
          </Row>
          <CardBody>
            {links.length === 0 ? (
              <Empty>{t('No links yet — add your favourites above.')}</Empty>
            ) : (
              <LinkGrid>
                {links.map((l, i) => (
                  <LinkTile
                    key={`${l.name}-${i}`}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    $color={PALETTE[i % PALETTE.length]}
                  >
                    <LinkDelete
                      type="button"
                      aria-label={t('Remove')}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeLink(i);
                      }}
                    >
                      &times;
                    </LinkDelete>
                    <ShortcutMark $color={PALETTE[i % PALETTE.length]}>
                      {(l.name[0] || '?').toUpperCase()}
                    </ShortcutMark>
                    <ShortcutLabel>{l.name}</ShortcutLabel>
                  </LinkTile>
                ))}
              </LinkGrid>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHead>
            <CardDot $color="#b06cff" />
            <CardTitle>{t('To-do')}</CardTitle>
            {todos.length > 0 && (
              <CardBadge>
                {doneCount}/{todos.length}
              </CardBadge>
            )}
          </CardHead>
          <Row onSubmit={addTodo}>
            <InsetField
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              placeholder={t('What needs doing today?')}
              aria-label={t('What needs doing today?')}
            />
            <ActionBtn type="submit" aria-label={t('Add')}>
              <PlusIcon size={16} />
            </ActionBtn>
          </Row>
          <CardBody>
            {todos.length === 0 ? (
              <Empty>{t('All clear. Add a task above.')}</Empty>
            ) : (
              <TaskList>
                {todos.map((td) => (
                  <TaskItem key={td.id} $done={td.done}>
                    <TaskCheck
                      type="button"
                      $done={td.done}
                      onClick={() => toggleTodo(td.id)}
                      aria-pressed={td.done}
                      aria-label={t('Toggle task')}
                    >
                      {td.done && <CheckIcon size={12} />}
                    </TaskCheck>
                    <TaskText $done={td.done}>{td.text}</TaskText>
                    <TaskDelete
                      type="button"
                      onClick={() => removeTodo(td.id)}
                      aria-label={t('Delete task')}
                    >
                      &times;
                    </TaskDelete>
                  </TaskItem>
                ))}
              </TaskList>
            )}
          </CardBody>
        </Card>
      </Grid>

      <Card>
        <CardHead>
          <CardDot $color="#1db954" />
          <CardTitle>{t('Notes')}</CardTitle>
        </CardHead>
        <Notes
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('Jot down anything — saved to this browser.')}
        />
        <Hint>{t('Saved locally')}</Hint>
      </Card>

      <Card>
        <CardHead>
          <CardDot $color="#e8a838" />
          <CardTitle>{t('Focus timer')}</CardTitle>
        </CardHead>
        <PomodoroTimer />
      </Card>
    </Panel>
  );
}
