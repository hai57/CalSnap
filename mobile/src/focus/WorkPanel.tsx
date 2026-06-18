import { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  DEFAULT_LINKS,
  K,
  PALETTE,
  type Link,
  type Todo,
} from '@shared/focus/constants';
import { newId, usePersisted } from '../hooks/focusHooks';
import { useLang } from '../i18n';
import { CheckIcon } from '../icons';
import { colors } from '../theme';
import { PomodoroTimer } from './PomodoroTimer';
import {
  InlineField,
  Panel,
  SectionHeader,
} from './ui';

export function WorkPanel() {
  const { t } = useLang();
  const [links, setLinks] = usePersisted<Link[]>(K('links'), DEFAULT_LINKS);
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [todos, setTodos] = usePersisted<Todo[]>(K('todos'), []);
  const [todoInput, setTodoInput] = useState('');
  const [notes, setNotes] = usePersisted(K('notes'), '');

  const addLink = () => {
    const name = linkName.trim();
    let url = linkUrl.trim();
    if (!name || !url) return;
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    setLinks([...links, { name, url }]);
    setLinkName('');
    setLinkUrl('');
  };

  const addTodo = () => {
    const text = todoInput.trim();
    if (!text) return;
    setTodos([...todos, { id: newId(), text, done: false }]);
    setTodoInput('');
  };

  const doneCount = todos.filter((td) => td.done).length;

  return (
    <Panel accent="#6c8cff">
      <SectionHeader
        eyebrow={t('Work')}
        title={t('Plan, capture, focus, repeat.')}
        badge={t('In session')}
        accent="#6c8cff"
      />
      <View style={{ padding: 16, paddingTop: 0, gap: 16 }}>
        <View style={{ alignItems: 'center', paddingVertical: 8 }}>
          <PomodoroTimer />
        </View>

        <View>
          <Text style={{ fontWeight: '700', color: colors.text, marginBottom: 8 }}>
            {t('Quick links')}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            {links.map((link, i) => (
              <Pressable
                key={`${link.url}-${i}`}
                onPress={() => void Linking.openURL(link.url)}
                onLongPress={() => setLinks(links.filter((_, idx) => idx !== i))}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: `${PALETTE[i % PALETTE.length]}18`,
                  borderWidth: 1,
                  borderColor: `${PALETTE[i % PALETTE.length]}44`,
                }}
              >
                <Text style={{ fontWeight: '700', color: colors.text }}>{link.name}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <InlineField
              value={linkName}
              onChangeText={setLinkName}
              placeholder={t('Name (e.g. Jira)')}
            />
            <InlineField
              value={linkUrl}
              onChangeText={setLinkUrl}
              placeholder="https://"
              autoCapitalize="none"
            />
            <Pressable
              onPress={addLink}
              style={{
                paddingHorizontal: 14,
                borderRadius: 10,
                backgroundColor: colors.brand,
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>{t('Add')}</Text>
            </Pressable>
          </View>
        </View>

        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontWeight: '700', color: colors.text }}>{t('To-do')}</Text>
            {todos.length > 0 ? (
              <Text style={{ color: colors.muted, fontSize: 12 }}>
                {doneCount}/{todos.length}
              </Text>
            ) : null}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
            <InlineField
              value={todoInput}
              onChangeText={setTodoInput}
              placeholder={t('What needs doing today?')}
              onSubmitEditing={addTodo}
            />
            <Pressable
              onPress={addTodo}
              style={{
                paddingHorizontal: 14,
                borderRadius: 10,
                backgroundColor: colors.brand,
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>{t('Add')}</Text>
            </Pressable>
          </View>
          {todos.length === 0 ? (
            <Text style={{ color: colors.muted, fontSize: 13 }}>
              {t('All clear. Add a task above.')}
            </Text>
          ) : (
            todos.map((td) => (
              <View
                key={td.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Pressable
                  onPress={() =>
                    setTodos(
                      todos.map((x) =>
                        x.id === td.id ? { ...x, done: !x.done } : x,
                      ),
                    )
                  }
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    borderWidth: 1.5,
                    borderColor: td.done ? '#b97f1e' : colors.border,
                    backgroundColor: td.done ? '#e8a838' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {td.done ? <CheckIcon size={12} color="#2a1d05" /> : null}
                </Pressable>
                <Text
                  style={{
                    flex: 1,
                    color: colors.text,
                    textDecorationLine: td.done ? 'line-through' : 'none',
                    opacity: td.done ? 0.55 : 1,
                  }}
                >
                  {td.text}
                </Text>
                <Pressable onPress={() => setTodos(todos.filter((x) => x.id !== td.id))}>
                  <Text style={{ color: colors.muted }}>×</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>

        <View>
          <Text style={{ fontWeight: '700', color: colors.text, marginBottom: 8 }}>
            {t('Notes')}
          </Text>
          <InlineField
            value={notes}
            onChangeText={setNotes}
            placeholder={t('Jot down anything — saved to this browser.')}
            multiline
            style={{ minHeight: 90, textAlignVertical: 'top' }}
          />
        </View>
      </View>
    </Panel>
  );
}
