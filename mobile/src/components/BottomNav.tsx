import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {clearSessionToken} from "@/services/athleteStorage";


type BottomNavProps = {
    activeRoute: "login" | "weekly" | "history" | "analysis";
    storedAthleteId?: any;
};

export function BottomNav({ activeRoute, storedAthleteId }: BottomNavProps) {
    return (
        <View style={styles.container}>
            <Pressable
                style={styles.navItem}
                onPress={() => router.replace("/")}
            >
                { !storedAthleteId &&
                    <Text
                    style={[
                        styles.navText,
                        activeRoute === "login" && styles.activeText,
                    ]}
                    onPress={()=> {
                        clearSessionToken()
                        router.replace("/")}}>
                    Logout
                </Text>
                }
            </Pressable>

            <Pressable
                style={styles.navItem}
                onPress={() => router.replace("/dashboard")}
            >
                <Text
                    style={[
                        styles.navText,
                        activeRoute === "weekly" && styles.activeText,
                    ]}
                >
                    Weekly
                </Text>
            </Pressable>

            <Pressable
                style={styles.navItem}
                onPress={() => router.push("/history")}
            >
                <Text
                    style={[
                        styles.navText,
                        activeRoute === "history" && styles.activeText,
                    ]}
                >
                    History
                </Text>
            </Pressable>

            <Pressable
                style={styles.navItem}
                onPress={() => router.replace("/analysis")}
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
        fontSize: 18,
        fontWeight: "800",
    },
    activeText: {
        color: "#fd5900",
    },
});