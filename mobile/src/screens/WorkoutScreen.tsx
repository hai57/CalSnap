import { ScrollView, Text, View } from 'react-native';

import { useLang } from '../i18n';
import { WorkoutPanel } from '../focus/WorkoutPanel';
import { colors } from '../theme';

export function WorkoutScreen() {
  const { t } = useLang();

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
            color: '#e6502f',
          }}
        >
          {t('Workout')}
        </Text>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '800',
            color: colors.text,
            marginTop: 4,
          }}
        >
          {t('Train with intent.')}
        </Text>
      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <WorkoutPanel />
      </View>
    </ScrollView>
  );
}
