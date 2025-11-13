import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Account() {
  const [participation, setParticipation] = useState({});

  const loadParticipation = () => {
    const stored = localStorage.getItem("participation");
    if (stored) {
      try {
        setParticipation(JSON.parse(stored));
      } catch (e) {
        console.error("Eroare la parsare:", e);
      }
    }
  };

  useEffect(() => {
    loadParticipation();
    const interval = setInterval(loadParticipation, 1000);
    return () => clearInterval(interval);
  }, []);

  const participatingEvents = Object.keys(participation).filter(
    (title) => participation[title]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contul Meu</Text>
      <Text style={styles.subtitle}>Evenimente la care participi:</Text>
      {participatingEvents.length > 0 ? (
        <ScrollView style={styles.list}>
          {participatingEvents.map((title) => (
            <View key={title} style={styles.eventItem}>
              <Text style={styles.eventText}>{title}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.empty}>Nu participi la niciun eveniment încă.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1B2B", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#FFB162", marginBottom: 20 },
  subtitle: { fontSize: 18, color: "#EEE9DF", marginBottom: 15 },
  list: { flex: 1 },
  eventItem: {
    backgroundColor: "#1E2A38",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  eventText: { color: "#EEE9DF", fontSize: 16 },
  empty: {
    color: "#8A8A8A",
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 50,
  },
});