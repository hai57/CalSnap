import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewProps,
} from "react-native";

import { colors } from "./theme";

export function Card({ style, children, ...rest }: ViewProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 18,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: "#0f172a",
          shadowOpacity: 0.06,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 2,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

export function PrimaryButton({
  title,
  onPress,
  loading,
  disabled,
  icon,
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  const off = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      style={({ pressed }) => ({
        flexDirection: "row",
        gap: 8,
        backgroundColor: pressed && !off ? colors.brandDark : colors.brand,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        opacity: off ? 0.5 : 1,
      })}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {icon}
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

export function Field({
  label,
  ...rest
}: TextInputProps & { label: string }) {
  const disabled = rest.editable === false;
  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: colors.muted,
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 16,
          color: colors.text,
          backgroundColor: colors.card,
          opacity: disabled ? 0.5 : 1,
        }}
        {...rest}
      />
    </View>
  );
}
