import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {SummaryCard} from "../components/SummaryCard";
import {activities} from "@/data/mockActivities";
import {ActivityCard} from "../components/ActivityCard";


export default function HomeScreen() {
  return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.appName}>TrainGuard</Text>
              <Text style={styles.subtitle}>Activity Feed</Text>
            </View>

            <TouchableOpacity style={styles.syncButton}>
              <Text style={styles.syncText}>Sync</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statusCard}>
            <Text style={styles.label}>Training Status</Text>
            <Text style={styles.statusTitle}>Yellow</Text>
            <Text style={styles.statusMessage}>
              One activity needs a recovery check-in. Complete it to update your risk status.
            </Text>
          </View>

          <View style={styles.summaryGrid}>
            <SummaryCard label="Run Miles" value="32.4" unit="mi" />
            <SummaryCard label="Bike Time" value="5.2" unit="hr" />
            <SummaryCard label="Pending" value="2" unit="check-ins" />
            <SummaryCard label="Pain" value="3" unit="/10" />
          </View>

          <Text style={styles.sectionTitle}>Recent Activities</Text>

          <View style={styles.activityList}>
            {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
            ))}
          </View>
        </ScrollView>
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
    paddingBottom: 40,
  },
  header: {
    marginTop: 32,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appName: {
    color: "#fd5900",
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: "#c5c6cd",
    fontSize: 14,
    marginTop: 2,
  },
  syncButton: {
    backgroundColor: "#fd5900",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  syncText: {
    color: "#501600",
    fontWeight: "800",
  },
  statusCard: {
    backgroundColor: "#16253b",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#fd5900",
  },
  label: {
    color: "#c5c6cd",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 8,
  },
  statusTitle: {
    color: "#e0e3e5",
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 6,
  },
  statusMessage: {
    color: "#c5c6cd",
    fontSize: 15,
    lineHeight: 22,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#c5c6cd",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "700",
    marginBottom: 12,
  },
  activityList: {
    gap: 14,
  },
});