import React from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";

type AboutModalProps = {
    visible: boolean;
    onClose: () => void;
};

export function About({
                               visible,
                               onClose,
                           }: AboutModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={onClose}
                />

                <View style={styles.modalCard}>
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Ionicons
                                name="information-circle-outline"
                                size={28}
                                color="#fd5900"
                            />

                            <Text style={styles.title}>
                                About Smart Gauge
                            </Text>
                        </View>

                        <Pressable
                            style={styles.closeButton}
                            onPress={onClose}
                            accessibilityRole="button"
                            accessibilityLabel="Close About Smart Gauge"
                        >
                            <Ionicons
                                name="close"
                                size={24}
                                color="#c5c6cd"
                            />
                        </Pressable>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator
                    >
                        <Text style={styles.paragraph}>
                            There are many apps designed to track
                            workouts, heart rate, distance, pace,
                            and other performance metrics. However,
                            most do not make it easy to track how
                            the athlete actually felt during and
                            after a workout.
                        </Text>

                        <Text style={styles.paragraph}>
                            Smart Gauge was created to help fill
                            that gap. It allows athletes to record
                            personal recovery metrics such as rate
                            of perceived exertion, mood, pain
                            score, and pain location through a
                            simple post-workout check-in.
                        </Text>

                        <Text style={styles.paragraph}>
                            Smart Gauge is designed to work
                            alongside existing fitness platforms
                            rather than replace them. Activity
                            information can be combined with
                            recovery notes and weather conditions
                            to provide a more complete view of
                            each workout.
                        </Text>

                        <Text style={styles.paragraph}>
                            The History tab gives athletes a quick
                            snapshot of their training and recovery
                            information, while the Analysis tab
                            helps identify changes and trends over
                            time.
                        </Text>

                        <Text style={styles.paragraph}>
                            By combining physical performance data
                            with perceived effort, mood, pain,
                            weather, and personal notes, Smart
                            Gauge helps athletes better understand
                            how their bodies respond to training.
                        </Text>

                        <View style={styles.notice}>
                            <Ionicons
                                name="medical-outline"
                                size={22}
                                color="#fd5900"
                            />

                            <Text style={styles.noticeText}>
                                Smart Gauge is intended for
                                personal training and recovery
                                awareness. It does not provide
                                medical diagnosis or treatment.
                            </Text>
                        </View>
                    </ScrollView>

                    <Pressable
                        style={styles.doneButton}
                        onPress={onClose}
                    >
                        <Text style={styles.doneButtonText}>
                            Done
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.72)",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },

    modalCard: {
        width: "100%",
        maxWidth: 520,
        maxHeight: "78%",
        backgroundColor: "#151b1f",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#263238",
        overflow: "hidden",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.35,
        shadowRadius: 18,
        elevation: 12,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#263238",
    },

    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    title: {
        color: "#e0e3e5",
        fontSize: 20,
        fontWeight: "800",
    },

    closeButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#20282c",
    },

    scrollView: {
        flexGrow: 0,
    },

    scrollContent: {
        padding: 20,
        paddingBottom: 10,
    },

    paragraph: {
        color: "#c5c6cd",
        fontSize: 15,
        lineHeight: 23,
        marginBottom: 16,
    },

    notice: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        backgroundColor: "rgba(253,89,0,0.08)",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(253,89,0,0.25)",
        padding: 14,
        marginTop: 4,
    },

    noticeText: {
        flex: 1,
        color: "#c5c6cd",
        fontSize: 13,
        lineHeight: 19,
    },

    doneButton: {
        margin: 20,
        marginTop: 12,
        backgroundColor: "#fd5900",
        borderRadius: 12,
        alignItems: "center",
        paddingVertical: 13,
    },

    doneButtonText: {
        color: "#101415",
        fontSize: 16,
        fontWeight: "800",
    },
});