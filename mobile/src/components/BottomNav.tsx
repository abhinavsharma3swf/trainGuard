import {router} from "expo-router";
import {Pressable, StyleSheet, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {clearSessionToken} from "@/services/athleteStorage";

type BottomNavProps = {
    activeRoute: "account" | "weekly" | "history" | "analysis";
    storedAthleteId?: string | number | null;
};

type NavIconProps = {
    active: boolean;
    activeIcon: keyof typeof Ionicons.glyphMap;
    inactiveIcon: keyof typeof Ionicons.glyphMap;
};

function NavIcon({
                     active,
                     activeIcon,
                     inactiveIcon,
                 }: NavIconProps) {
    return (
        <View
            style={[
                styles.iconWrapper,
                active && styles.activeIconWrapper,
            ]}
        >
            <Ionicons
                name={active ? activeIcon : inactiveIcon}
                size={25}
                color={active ? "#fd5900" : "#7d8a91"}
            />

            {active && <View style={styles.activeDot}/>}
        </View>
    );
}

export function BottomNav({
                              activeRoute,
                              storedAthleteId,
                          }: BottomNavProps) {
    const handleLogout = async () => {
        await clearSessionToken();
        router.replace("/");
    };

    return (
        <View style={styles.container}>

            <Pressable
                style={styles.navItem}
                onPress={() => router.replace("/dashboard")}
            >
                <NavIcon
                    active={activeRoute === "weekly"}
                    activeIcon="home"
                    inactiveIcon="home-outline"
                />
            </Pressable>

            <Pressable
                style={styles.navItem}
                onPress={() => router.replace("/history")}
            >
                <NavIcon
                    active={activeRoute === "history"}
                    activeIcon="time"
                    inactiveIcon="time-outline"
                />
            </Pressable>

            <Pressable
                style={styles.navItem}
                onPress={() => router.replace("/analysis")}
            >
                <NavIcon
                    active={activeRoute === "analysis"}
                    activeIcon="analytics"
                    inactiveIcon="analytics-outline"
                />
            </Pressable>

            <Pressable
                style={styles.navItem}
                onPress={() => router.replace("/account")}
            >
                <NavIcon
                    active={activeRoute === "account"}
                    activeIcon="person-circle"
                    inactiveIcon="person-circle-outline"
                />
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
        height: 68,
        backgroundColor: "#181919",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#fd5900",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,

        shadowColor: "#686262",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
    },

    navItem: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },

    iconWrapper: {
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: "center",
        justifyContent: "center",
    },

    activeIconWrapper: {
        backgroundColor: "rgba(253,89,0,0.12)",
    },

    activeDot: {
        position: "absolute",
        bottom: 4,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#fd5900",
    },
});