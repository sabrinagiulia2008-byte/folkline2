import * as React from "react";
import { Text, View } from "react-native";

export default function TestApp() {
  console.log("✅ TestApp renderizat!");
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1B2632",
      }}
    >
      <Text style={{ color: "#FFB162", fontSize: 24 }}>
        Hello from Folkline 👋
      </Text>
    </View>
  );
}
