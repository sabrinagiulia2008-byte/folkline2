// src/screens/Explore.js
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const countriesData = require("../data/countries.json");

export default function Explore() {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  const filteredCountries = countriesData.features.filter((feature) =>
    feature.properties.name.toLowerCase().includes(search.toLowerCase())
  );

  const onCountryClick = (feature) => {
    setSelectedCountry(feature.properties);
  };

  const countryStyle = {
    fillColor: "#FFB162",
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };

  const highlightStyle = {
    ...countryStyle,
    fillColor: "#FF6B35",
    weight: 3,
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Caută o țară..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.mapContainer}>
        <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          />
          {filteredCountries.map((feature) => (
            <GeoJSON
              key={feature.properties.iso_a2}
              data={feature}
              style={
                selectedCountry?.iso_a2 === feature.properties.iso_a2
                  ? highlightStyle
                  : countryStyle
              }
              onEachFeature={(feature, layer) => {
                layer.on({ click: () => onCountryClick(feature) });
              }}
            />
          ))}
        </MapContainer>
      </View>

      {selectedCountry && (
        <View style={styles.bottomPanel}>
          <Text style={styles.panelTitle}>{selectedCountry.name}</Text>
          <Text style={styles.panelText}>
            {selectedCountry.description || "Fără descriere."}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1B2B" },
  searchInput: {
    margin: 15,
    padding: 12,
    backgroundColor: "#1E2A38",
    color: "#EEE9DF",
    borderRadius: 12,
    fontSize: 16,
  },
  mapContainer: { flex: 1 },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1E2A38",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelTitle: { fontSize: 20, fontWeight: "bold", color: "#FFB162" },
  panelText: { color: "#EEE9DF", marginTop: 5 },
});