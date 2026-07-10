import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {clearAthleteId} from "@/services/athleteStorage";

type BottomNavProps = {
    activeRoute: "login" | "dashboard" | "analysis";
    storedAthleteId?: number;
};

export function BottomNav({ activeRoute, storedAthleteId }: BottomNavProps) {
    return (
        <View style={styles.container}>
            <Pressable
                style={styles.navItem}
                onPress={() => router.push("/")}
            >
                { !storedAthleteId &&
                    <Text
                    style={[
                        styles.navText,
                        activeRoute === "login" && styles.activeText,
                    ]}
                    onPress={()=> {
                        clearAthleteId()
                        router.replace("/")}}>
                    Logout
                </Text>
                }
            </Pressable>

            <Pressable
                style={styles.navItem}
                onPress={() => router.push("/dashboard")}
            >
                <Text
                    style={[
                        styles.navText,
                        activeRoute === "dashboard" && styles.activeText,
                    ]}
                >
                    Dashboard
                </Text>
            </Pressable>

            <Pressable
                style={styles.navItem}
                onPress={() => router.push("/analysis")}
            >
                <Text
                    style={[
                        styles.navText,
                        activeRoute === "analysis" && styles.activeText,
                    ]}
                >
                    Analysis
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 16,
        backgroundColor: "#151b1f",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "#263238",
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    navItem: {
        flex: 1,
        alignItems: "center",
    },
    navText: {
        color: "#7d8a91",
        fontSize: 13,
        fontWeight: "800",
    },
    activeText: {
        color: "#fd5900",
    },
});