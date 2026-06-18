import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { WebView } from 'react-native-webview';

import { colors } from '../theme';

export function Panel({
  children,
  style,
  accent,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  accent?: string;
}) {
  return (
    <View
      style={[
        {
          borderRadius: 16,
          borderWidth: 1,
          borderColor: accent ? `${accent}44` : colors.border,
          backgroundColor: colors.card,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  badge,
  accent = colors.brand,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  accent?: string;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
        padding: 16,
        paddingBottom: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        {eyebrow ? (
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: accent,
              marginBottom: 4,
            }}
          >
            {eyebrow}
          </Text>
        ) : null}
        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text }}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ fontSize: 13, color: colors.muted, marginTop: 4 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {badge ? (
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 999,
            backgroundColor: `${accent}18`,
            borderWidth: 1,
            borderColor: `${accent}44`,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '700',
              letterSpacing: 1,
              textTransform: 'uppercase',
              color: accent,
            }}
          >
            {badge}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export function TabRow<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string; icon?: string }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 12 }}
    >
      {tabs.map((tab) => {
        const on = tab.id === active;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 9,
              borderRadius: 999,
              backgroundColor: on ? colors.brand : colors.bg,
              borderWidth: 1,
              borderColor: on ? colors.brand : colors.border,
            }}
          >
            {tab.icon ? (
              <Text style={{ fontSize: 14, opacity: on ? 1 : 0.7 }}>{tab.icon}</Text>
            ) : null}
            <Text
              style={{
                fontWeight: '700',
                fontSize: 13,
                color: on ? '#fff' : colors.text,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export function Pill({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: active ? colors.brand : colors.bg,
        borderWidth: 1,
        borderColor: active ? colors.brand : colors.border,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: '700',
          color: active ? '#fff' : colors.text,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function InlineField(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      style={{
        flex: 1,
        minWidth: 0,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: colors.text,
        backgroundColor: colors.bg,
      }}
      {...props}
    />
  );
}

export function IconBtn({
  onPress,
  label,
  primary,
}: {
  onPress: () => void;
  label: string;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: primary ? colors.brand : colors.bg,
        borderWidth: 1,
        borderColor: primary ? colors.brand : colors.border,
      }}
    >
      <Text style={{ color: primary ? '#fff' : colors.text, fontWeight: '700' }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function EmbedFrame({
  uri,
  height,
}: {
  uri: string;
  height: number;
}) {
  return (
    <View style={{ height, borderRadius: 12, overflow: 'hidden' }}>
      <WebView
        source={{ uri }}
        style={{ flex: 1, backgroundColor: colors.bg }}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled
      />
    </View>
  );
}
