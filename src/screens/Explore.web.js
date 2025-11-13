import React from 'react';
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getEventsByCountry, searchEventsByKeyword } from "../services/api";

export default function Explore() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [events, setEvents] = useState([]);
  const [participation, setParticipation] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const isInitialLoad = useRef(true);

  const countryMap = {
    "România": "RO", "Romania": "RO",
    "Brazilia": "BR", "Brazil": "BR",
    "Japonia": "JP", "Japan": "JP",
    "Germania": "DE", "Germany": "DE",
    "Mexic": "MX", "Mexico": "MX",
    "Polonia": "PL", "Poland": "PL",
  };

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem("participation");
      if (stored) setParticipation(JSON.parse(stored));
    };
    load();
  }, []);

  const saveParticipation = (newP) => {
    localStorage.setItem("participation", JSON.stringify(newP));
  };

  useEffect(() => {
    const handler = (e) => {
      const name = e.data?.trim();
      if (!name || isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }
      const code = countryMap[name];
      if (!code) return;
      setLoading(true);
      setSelectedCountry(name);
      getEventsByCountry(code).then(setEvents).finally(() => setLoading(false));
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleSearch = () => {
    if (!search.trim()) return;
    setLoading(true);
    setSelectedCountry(null);
    searchEventsByKeyword(search).then(setEvents).finally(() => {
      setLoading(false);
      setSearch("");
    });
  };

  const toggleParticipate = (title) => {
    const newP = { ...participation, [title]: !participation[title] };
    setParticipation(newP);
    saveParticipation(newP);
  };

  const clearResults = () => {
    setEvents([]);
    setSelectedCountry(null);
  };

  return (
    <View style={s.container}>
      <View style={s.top}>
        <Text style={s.logo}>Folkline</Text>
      </View>

      <View style={s.search}>
        <TextInput
          style={s.input}
          placeholder="Caută țară, eveniment, @user..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Text style={s.searchBtn}>Search</Text>
        </TouchableOpacity>
      </View>

      <iframe src="/map.html" style={{ flex: 1, border: 0 }} title="map" />

      {loading && (
        <ActivityIndicator
          color="#FFB162"
          size="large"
          style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -20, marginTop: -20 }}
        />
      )}

      {events.length > 0 && (
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={clearResults}>
          <View style={s.panel} onStartShouldSetResponder={() => true}>
            <Text style={s.title}>{selectedCountry || "Rezultate"}</Text>
            <ScrollView style={s.scroll}>
              {events.map((e, i) => (
                <View key={i} style={s.card}>
                  {e.image && (
                    <Image
                      source={{ uri: e.image }}
                      style={s.img}
                      resizeMode="cover"
                    />
                  )}
                  <Text style={s.event}>{e.title || "Postare"}</Text>
                  {e.author && <Text style={s.author}>@{e.author}</Text>}
                  <Text style={s.desc}>{e.description}</Text>
                  {e.title && (
                    <TouchableOpacity
                      style={[s.btn, participation[e.title] && s.btnActive]}
                      onPress={() => toggleParticipate(e.title)}
                    >
                      <Text style={s.btnText}>
                        {participation[e.title] ? "Participi" : "Participă"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1B2632" },
  top: { padding: 15, alignItems: "center" },
  logo: { fontSize: 28, fontWeight: "bold", color: "#FFB162" },
  search: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#2C3E50",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#34495E",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
  },
  searchBtn: { color: "#FFB162", fontSize: 16, fontWeight: "bold" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  panel: {
    backgroundColor: "#2C3E50",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
  },
  title: {
    color: "#FFB162",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 15,
  },
  scroll: { maxHeight: 500 },
  card: {
    backgroundColor: "#34495E",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  img: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  event: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  author: { color: "#FFB162", fontSize: 14, marginVertical: 4 },
  desc: { color: "#ddd", fontSize: 14, marginBottom: 10 },
  btn: {
    backgroundColor: "#FFB162",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnActive: { backgroundColor: "#F5F5DC" },
  btnText: { color: "#1B2632", fontWeight: "bold" },
});