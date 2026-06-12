import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type NavigationState,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useRef } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/auth';
import { BotProvider, NutriBot } from './src/bot';
import { LanguageProvider, useLang } from './src/i18n';
import { ThemeProvider, useTheme } from './src/themeContext';
import { ToastProvider } from './src/toast';
import { colors } from './src/theme';
import { AddScreen } from './src/screens/AddScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { GoalsScreen } from './src/screens/GoalsScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{label}</Text>
  );
}

function AddFoodButton({ onPress }: { onPress: () => void }) {
  const { t } = useLang();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? colors.brandDark : colors.brand,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        marginRight: 12,
      })}
    >
      <Text style={{ color: '#fff', fontWeight: '700' }}>{t('+ Add food')}</Text>
    </Pressable>
  );
}

function AppTabs() {
  const { t } = useLang();
  return (
    <Tabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700', color: colors.text },
        headerTintColor: colors.text,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerRight: () => (
          <AddFoodButton onPress={() => navigation.navigate('Add')} />
        ),
      })}
    >
      <Tabs.Screen
        name="Today"
        component={DashboardScreen}
        options={{
          title: t('Today'),
          tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="Progress"
        component={HistoryScreen}
        options={{
          title: t('Progress'),
          tabBarIcon: ({ focused }) => <TabIcon label="📊" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t('Profile'),
          tabBarIcon: ({ focused }) => <TabIcon label="⚙️" focused={focused} />,
        }}
      />
    </Tabs.Navigator>
  );
}

function AppNavigator() {
  const { t } = useLang();
  return (
    <AppStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700' },
        headerTintColor: colors.text,
      }}
    >
      <AppStack.Screen
        name="Main"
        component={AppTabs}
        options={{ headerShown: false }}
      />
      <AppStack.Screen
        name="Add"
        component={AddScreen}
        options={{ title: t('Add food') }}
      />
      <AppStack.Screen
        name="Goals"
        component={GoalsScreen}
        options={{ title: t('Daily goals') }}
      />
    </AppStack.Navigator>
  );
}

function navTheme(scheme: 'light' | 'dark') {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.brand,
      background: colors.bg,
      card: colors.card,
      text: colors.text,
      border: colors.border,
    },
  };
}

function Root() {
  const { user, loading } = useAuth();
  const { scheme, version } = useTheme();
  // Persisted across the theme remount (lives in this non-remounted parent).
  const navStateRef = useRef<NavigationState | undefined>(undefined);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.bg,
        }}
      >
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  return (
    <View key={version} style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer
        theme={navTheme(scheme)}
        initialState={navStateRef.current}
        onStateChange={(s) => {
          navStateRef.current = s ?? undefined;
        }}
      >
        {user ? (
          <AppNavigator />
        ) : (
          <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
          </AuthStack.Navigator>
        )}
      </NavigationContainer>
      {user ? <NutriBot /> : null}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <BotProvider>
              <AuthProvider>
                <Root />
              </AuthProvider>
            </BotProvider>
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
