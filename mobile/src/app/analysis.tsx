import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BottomNav } from "@/components/BottomNav";

export default function AnalysisScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.appName}>Smart Gauge</Text>
        <Text style={styles.subtitle}>Analysis</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Coming Soon</Text>
          <Text style={styles.cardMessage}>
            This screen will analyze your training load, recovery check-ins,
            pain trends, and activity patterns.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Future Metrics</Text>
          <Text style={styles.cardMessage}>
            Planned analysis includes weekly run miles, bike time, average RPE,
            pain trend, and readiness changes over time.
          </Text>
        </View>
      </ScrollView>

      <BottomNav activeRoute="analysis" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#101415",
  },
  content: {
    padding: 20,
    paddingTop: 56,
    paddingBottom: 110,
  },
  appName: {
    color: "#fd5900",
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 4,
  },
  subtitle: {
    color: "#c5c6cd",
    fontSize: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#151b1f",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#263238",
    marginBottom: 14,
  },
  cardTitle: {
    color: "#e0e3e5",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 8,
  },
  cardMessage: {
    color: "#c5c6cd",
    fontSize: 15,
    lineHeight: 22,
  },
});