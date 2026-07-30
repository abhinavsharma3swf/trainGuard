import React, {Dispatch, SetStateAction} from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";

type PrivacyStatementProps = {
    privacyStatementFlag: boolean
    setPrivacyStatementFlag: Dispatch<SetStateAction<boolean>>
};

export function PrivacyStatement({
                                     privacyStatementFlag,
                                     setPrivacyStatementFlag,
                      }: PrivacyStatementProps) {
    return (
        <Modal
            visible={privacyStatementFlag}
            transparent
            animationType="fade"
            onRequestClose={()=>setPrivacyStatementFlag}
        >
            <View style={globalStyles.overlay}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={()=>setPrivacyStatementFlag}
                />

                <View style={globalStyles.modalCard}>
                    <View style={globalStyles.header}>
                        <View style={globalStyles.titleContainer}>
                            <Ionicons
                                name="information-circle-outline"
                                size={28}
                                color="#fd5900"
                            />

                            <Text style={globalStyles.title}>
                                Privacy & Data Collection Policy
                            </Text>
                        </View>
                    </View>

                    <ScrollView
                        style={globalStyles.scrollView}
                        contentContainerStyle={globalStyles.scrollContent}
                        showsVerticalScrollIndicator
                    >
                        <Text style={globalStyles.paragraph}>
                            Smart Gauge connects to Strava only after you expressly authorize access through Strava’s account authorization process.
                            Smart Gauge requests the read and read_all scopes.
                            We use these permissions to retrieve your Strava athlete identifier and recent activity information
                            so that you can select a workout and complete a private recovery check-in.
                        </Text>

                        <Text style={globalStyles.paragraph}>
                            Depending on the information available for an activity,
                            imported data may include the activity identifier, activity name, sport type,
                            start date and time, distance, moving and elapsed time, elevation gain, power information, description and limited starting-location information to display the weather data.
                            Smart Gauge also stores OAuth credentials required to maintain the connection. Smart Gauge does not receive your Strava password.
                        </Text>

                        <Text style={globalStyles.paragraph}>
                            Imported Strava activity data is retained for no longer than seven days and is removed through scheduled backend cleanup.
                            We also process Strava webhook notifications to remove activities that are deleted or become unavailable.
                            Strava Data is visible only to the authenticated athlete and is not sold, used for targeted advertising,
                            shared with other Smart Gauge users, or submitted to artificial-intelligence or machine-learning systems.
                        </Text>

                        <Text style={globalStyles.paragraph}>
                            You may disconnect Strava or delete your Smart Gauge account through the application.
                            Disconnecting Strava revokes the connection, stops future synchronization and deletes stored OAuth credentials and cached Strava activity data.
                            Deleting your Smart Gauge account also deletes your recovery check-ins, sessions and account record.
                        </Text>

                        <Text style={globalStyles.paragraph}>
                            Strava may monitor and collect information concerning Smart Gauge’s use of the
                            Strava API and may use that information for purposes including API and platform improvements,
                            support and compliance monitoring.
                        </Text>

                        <View style={globalStyles.notice}>
                            <Ionicons
                                name="medical-outline"
                                size={22}
                                color="#fd5900"
                            />

                            <Text style={globalStyles.noticeText}>
                                Smart Gauge is intended for
                                personal training and recovery
                                awareness. It does not provide
                                medical diagnosis or treatment.
                            </Text>
                        </View>
                    </ScrollView>

                    <Pressable
                        style={globalStyles.doneButton}
                        onPress={()=> setPrivacyStatementFlag(false)}
                    >
                        <Text style={globalStyles.doneButtonText}>
                            Done
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

export const globalStyles = StyleSheet.create({
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
        fontSize: 17,
        fontWeight: "800",
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