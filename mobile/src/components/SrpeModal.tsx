import {Modal, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {globalStyles} from "@/components/PrivacyStatement";

interface SrpeProps {
    setSrpeFlag(isVisible: boolean): void;

    srpeFlag: boolean;
}

export function Srpe({srpeFlag, setSrpeFlag}: SrpeProps) {
    return (
        <Modal
            visible={srpeFlag}
            transparent
            animationType="fade"
        >
            <View style={globalStyles.overlay}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={()=>setSrpeFlag(false)}
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
                                Session Rating of Perceived Exertion
                            </Text>
                        </View>
                    </View>

                    <ScrollView
                        style={globalStyles.scrollView}
                        contentContainerStyle={globalStyles.scrollContent}
                        showsVerticalScrollIndicator
                    >

                        <Text style={globalStyles.paragraph}>
                            sRPE stands for Session Rating of Perceived Exertion. It measures how hard a workout felt by
                            combining the workout duration with your RPE score.</Text>

                        <Text style={globalStyles.paragraph}> Calculation: sRPE = workout duration in minutes ×
                            RPE </Text>

                        <Text style={globalStyles.paragraph}> Example: a 60-minute workout at RPE 7 gives an sRPE of
                            420. A higher score means a greater overall training load.
                        </Text>

                    </ScrollView>

                    <Pressable
                        style={globalStyles.doneButton}
                        onPress={() => setSrpeFlag(false)}
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