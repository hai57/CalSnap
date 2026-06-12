import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/auth';
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
      <Text style={{ color: '#fff', fontWeight: '700' }}>+ Add food</Text>
    </Pressable>
  );
}

function AppTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: colors.brandDark,
        tabBarInactiveTintColor: colors.muted,
        headerRight: () => (
          <AddFoodButton onPress={() => navigation.navigate('Add')} />
        ),
      })}
    >
      <Tabs.Screen
        name="Today"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="Progress"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="📊" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="⚙️" focused={focused} />,
        }}
      />
    </Tabs.Navigator>
  );
}

function AppNavigator() {
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
        options={{ title: 'Add food' }}
      />
      <AppStack.Screen
        name="Goals"
        component={GoalsScreen}
        options={{ title: 'Daily goals' }}
      />
    </AppStack.Navigator>
  );
}

function Root() {
  const { user, loading } = useAuth();

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
    <NavigationContainer>
      {user ? (
        <AppNavigator />
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Root />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
