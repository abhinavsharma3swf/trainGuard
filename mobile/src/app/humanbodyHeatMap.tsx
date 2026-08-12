import {KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import HumanBody from "@/components/HumanBody";
import {BodyPart} from "@/components/PathPoints";

interface Props {
    heatMapFlag: boolean;
    setHeatMapFlag: (flag: boolean) => void;
    enumsForHumanBodyHeatMapForAnalysisPage: BodyPart[];
}

export default function HumanbodyHeatMap({
                                             heatMapFlag,
                                             setHeatMapFlag,
                                             enumsForHumanBodyHeatMapForAnalysisPage
                                         }: Props) {

    const handleClose = () => (
        setHeatMapFlag(false)
    )



    return (
        <Modal
            visible={heatMapFlag}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View
                    style={styles.card}
                    // accessibilityViewIsModal
                >
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Ionicons
                                name="body"
                                size={26}
                                color="#fd5900"
                            />

                            <Text style={styles.title}>
                                HeatMap
                            </Text>

                        </View>
                        <View>

                            <Pressable style={styles.submitButton} onPress={handleClose}>
                                <Text style={styles.submitButtonText}>Close</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/*<ScrollView*/}
                    {/*    contentContainerStyle={styles.form}*/}
                    {/*    keyboardShouldPersistTaps="handled"*/}
                    {/*    showsVerticalScrollIndicator={false}*/}
                    {/*>*/}
                    <HumanBody selectedBodyParts={enumsForHumanBodyHeatMapForAnalysisPage}
                               setSelectedBodyParts={() => null}
                    mode='heatmap'/>
                    {/*</ScrollView>*/}
                    <View style={styles.card}>
<View style={styles.header}>
    <Text style={styles.title}>
        Legend:
        <View style={{paddingLeft: 15}}>
        <Text style={styles.label}>
            🟢 Reported below 3
        </Text>
        <Text style={styles.label}>
            🟡 Reported 3 or above but below 5
        </Text>
           <Text style={styles.label}>
               🔴 Reported 6 or above
           </Text>
        </View>
    </Text>
</View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}


const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.72)",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 32,
    },
    card: {
        width: "100%",
        maxWidth: 520,
        maxHeight: "90%",
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
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
    },
    form: {
        padding: 20,
        paddingBottom: 180,
    },
    introduction: {
        color: "#aeb4b7",
        fontSize: 13,
        lineHeight: 19,
        marginBottom: 20,
    },
    label: {
        color: "#e0e3e5",
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 7,
    },
    input: {
        width: "100%",
        minHeight: 48,
        color: "#e0e3e5",
        fontSize: 16,
        backgroundColor: "#101415",
        borderWidth: 1,
        borderColor: "#354047",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 11,
        marginBottom: 18,
    },
    pickerContainer: {
        minHeight: 50,
        justifyContent: "center",
        backgroundColor: "#101415",
        borderWidth: 1,
        borderColor: "#354047",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 18,
        // color: "#d7dde1",
    },
    messageInput: {
        minHeight: 150,
        maxHeight: 240,
        marginBottom: 6,
    },
    characterCount: {
        color: "#8b949e",
        fontSize: 12,
        textAlign: "right",
        marginBottom: 16,
    },
    errorText: {
        color: "#ffb4ab",
        fontSize: 14,
        fontWeight: "600",
        lineHeight: 20,
        marginBottom: 14,
    },
    submitButton: {
        minHeight: 30,
        backgroundColor: "#fd5900",
        borderRadius: 12,
        paddingHorizontal: 18,
    },
    submitContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    submitButtonText: {
        color: "#101415",
        fontSize: 16,
        fontWeight: "800",
        paddingTop: 5
    },
    disabledButton: {
        opacity: 0.45,
    },
    pressed: {
        opacity: 0.75,
    },
});