import React from 'react';
import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Account from "./src/screens/Account";
import Add from "./src/screens/Add";
import Explore from "./src/screens/Explore.web";
import Home from "./src/screens/Home";
import Messages from "./src/screens/Messages";

// Iconițe SVG (folosim emoji pentru simplitate, dar pot fi SVG-uri reale)
const HomeIcon = () => <Text style={styles.icon}>Home</Text>;
const ExploreIcon = () => <Text style={styles.icon}>Explore</Text>;
const AddIcon = () => <Text style={styles.icon}>Add</Text>;
const MessagesIcon = () => <Text style={styles.icon}>Messages</Text>;
const AccountIcon = () => <Text style={styles.icon}>Account</Text>;

export default function App() {
  const [screen, setScreen] = useState("Explore");

  const renderScreen = () => {
    switch (screen) {
      case "Home": return <Home />;
      case "Explore": return <Explore />;
      case "Add": return <Add />;
      case "Messages": return <Messages />;
      case "Account": return <Account />;
      default: return <Explore />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      <View style={styles.tabBar}>
        {[
          { name: "Home", icon: HomeIcon },
          { name: "Explore", icon: ExploreIcon },
          { name: "Add", icon: AddIcon },
          { name: "Messages", icon: MessagesIcon },
          { name: "Account", icon: AccountIcon },
        ].map(({ name, icon: Icon }) => (
          <TouchableOpacity
            key={name}
            onPress={() => setScreen(name)}
            style={[styles.tab, screen === name && styles.activeTab]}
          >
            <Icon />
            <Text style={[styles.tabText, screen === name && styles.activeText]}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1B2632" },
  content: { flex: 1 },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#1B2632",
    height: 56,
    borderTopWidth: 1,
    borderColor: "#2C3B4D",
    paddingBottom: 0,
  },
  tab: { flex: 1, justifyContent: "center", alignItems: "center" },
  activeTab: { backgroundColor: "#2C3B4D" },
  icon: { fontSize: 24, color: "#C9C1B1" },
  tabText: { color: "#C9C1B1", fontSize: 10, marginTop: 2 },
  activeText: { color: "#FFB162" },
});