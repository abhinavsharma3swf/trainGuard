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
import {globalStyles} from "@/components/PrivacyStatement";

type AboutModalProps = {
    betaDisclaimerFlag: boolean;
    setBetaDisclaimerFlag: Dispatch<SetStateAction<boolean>>
};

export function BetaDisclaimer({
                                   betaDisclaimerFlag,
                                   setBetaDisclaimerFlag,
                      }: AboutModalProps) {
    return (
        <Modal
            visible={betaDisclaimerFlag}
            transparent
            animationType="fade"
            onRequestClose={() => setBetaDisclaimerFlag}
        >
            <View style={globalStyles.overlay}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={() => setBetaDisclaimerFlag}
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
                                Beta Disclaimer
                            </Text>
                        </View>

                    </View>

                    <ScrollView
                        style={globalStyles.scrollContent}
                        nestedScrollEnabled
                        showsVerticalScrollIndicator
                    >
                        <Text style={globalStyles.paragraph}>
                            Smart Gauge is a beta fitness tracking and training analysis
                            application. By using this app, you acknowledge and agree that the
                            app is provided for informational, educational, and personal
                            tracking purposes only.
                        </Text>

                        <Text style={globalStyles.paragraph}>
                            Smart Gauge is not a medical device, healthcare service, coaching
                            service, emergency service, or substitute for professional medical
                            advice, diagnosis, treatment, or training guidance. Any information
                            displayed in the app, including activity history, recovery
                            check-ins, pain scores, training trends, performance metrics, or
                            alerts, should not be relied upon as medical, safety, or
                            professional training advice.
                        </Text>

                        <Text style={globalStyles.paragraph}>
                            You are responsible for your own training decisions, physical
                            activity, health choices, and use of the information displayed in
                            the app. You should consult a qualified medical professional,
                            coach, or other appropriate professional before making decisions
                            that may affect your health, injury risk, training load, or
                            physical performance.
                        </Text>

                        <Text style={globalStyles.paragraph}>
                            Smart Gauge may connect to third-party services, including Strava,
                            to import activity data. By connecting your Strava account, you
                            authorize Smart Gauge to access and store the activity data needed
                            to provide the app’s features. This may include activity names,
                            sport types, dates, distances, durations, elevation, heart rate,
                            power, recovery check-ins, pain scores, notes, and related training
                            information.
                        </Text>

                        <Text style={globalStyles.paragraph}>
                            Although reasonable efforts are made to protect user data, no
                            software system, network, server, database, or third-party
                            integration can be guaranteed to be completely secure,
                            uninterrupted, or error-free. You acknowledge that data may be
                            delayed, incomplete, inaccurate, unavailable, or affected by
                            third-party service changes, outages, user permissions, API
                            limitations, or technical issues.
                        </Text>

                        <Text style={globalStyles.paragraph}>
                            You are responsible for reviewing your own data and determining
                            whether it is accurate and appropriate for your personal use. Smart
                            Gauge and its developer are not responsible for decisions,
                            injuries, losses, damages, training outcomes, data inaccuracies,
                            service interruptions, third-party service issues, or other
                            consequences arising from your use of the app or reliance on
                            information displayed in the app. You release the developer from any liability and accept the risks
                        </Text>

                        <Text style={globalStyles.paragraph}>
                            Because this is a beta product, features may change, break, be
                            removed, or behave unexpectedly. Data may be modified, deleted,
                            reset, or lost during testing, development, hosting changes,
                            database migrations, or app updates.
                        </Text>

                        <Text style={globalStyles.paragraph}>
                            By continuing to use Smart Gauge, you agree that you understand
                            these limitations and accept responsibility for your use of the app
                            and any decisions you make based on its information.
                        </Text>
                    </ScrollView>

                    <Pressable
                        style={globalStyles.doneButton}
                        onPress={()=> setBetaDisclaimerFlag(false)}
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
