import {Ionicons} from "@expo/vector-icons";
import {Picker} from "@expo/ui";
// import { Picker } from '@react-native-picker/picker';


import React, {Dispatch, SetStateAction, useMemo, useState} from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import {submitContactUsModalData} from "@/services/contactUsModalApi";

type ContactCategory =
    | "feedback"
    | "question"
    | "feature_request";

export type ContactFormData = {
    name: string;
    email: string;
    category: string;
    message: string;
};

type ContactModalProps = {
    contactUsModal: boolean;
    setContactUsModal: Dispatch<SetStateAction<boolean>>;
};

export function ContactModal({contactUsModal, setContactUsModal}: ContactModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [category, setCategory] = useState("");
    const [message, setMessage] = useState("");

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedMessage = message.trim();
    const normalizeCategory = category.trim();

    const isEmailValid = useMemo(
        () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail),
        [normalizedEmail],
    );

    const isFormValid =
        normalizedName.length >= 2 &&
        isEmailValid &&
        normalizedMessage.length >= 10 &&
        !isSubmitting;

    const resetForm = () => {
        setName("");
        setEmail("");
        setCategory("feedback");
        setMessage("");
        setError("");
    };

    const handleClose = () => {
        if (isSubmitting) {
            return;
        }
        setContactUsModal(false);
        resetForm();

    };

    const handleSubmit = async () => {
        if (!normalizedName) {
            setError("Enter your name.");
            return;
        }

        if (!isEmailValid) {
            setError("Enter a valid email address.");
            return;
        }

        if (normalizedMessage.length < 10) {
            setError("Your message must contain at least 10 characters.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");

            await submitContactUsModalData({
                name: normalizedName,
                email: normalizedEmail,
                category: normalizeCategory,
                message: normalizedMessage,
            });

            resetForm();
            setContactUsModal(false);
        } catch {
            setError(
                "Your message could not be sent. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            visible={contactUsModal}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={handleClose}
                    accessibilityRole="button"
                    accessibilityLabel="Close contact form"
                />

                <View
                    style={styles.card}
                    accessibilityViewIsModal
                >
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Ionicons
                                name="mail-open-outline"
                                size={26}
                                color="#fd5900"
                            />

                            <Text style={styles.title}>
                                Contact us
                            </Text>
                        </View>

                        <Pressable
                            onPress={handleClose}
                            disabled={isSubmitting}
                            hitSlop={12}
                            accessibilityRole="button"
                            accessibilityLabel="Close contact form"
                            style={({pressed}) => [
                                styles.closeButton,
                                pressed && styles.pressed,
                            ]}
                        >
                            <Ionicons
                                name="close"
                                size={26}
                                color="#c5c6cd"
                            />
                        </Pressable>
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.form}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.introduction}>
                            Send a question, report an issue, or suggest a
                            feature. Do not include passwords or any personal information.
                        </Text>

                        <Text
                            nativeID="contact-name-label"
                            style={styles.label}
                        >
                            Your name
                        </Text>

                        <TextInput
                            style={styles.input}
                            accessibilityLabelledBy="contact-name-label"
                            placeholder="Enter your name"
                            placeholderTextColor="#8b8e8f"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                            autoComplete="name"
                            textContentType="name"
                            returnKeyType="next"
                            maxLength={100}
                        />

                        <Text
                            nativeID="contact-email-label"
                            style={styles.label}
                        >
                            Your email
                        </Text>

                        <TextInput
                            style={styles.input}
                            accessibilityLabelledBy="contact-email-label"
                            placeholder="Enter your email"
                            placeholderTextColor="#8b8e8f"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoComplete="email"
                            textContentType="emailAddress"
                            keyboardType="email-address"
                            autoCorrect={false}
                            returnKeyType="next"
                            maxLength={254}
                        />

                        <Text
                            nativeID="contact-category-label"
                            style={styles.label}
                        >
                            Message type
                        </Text>

                        <TextInput
                            style={styles.input}
                            accessibilityLabelledBy="contact-name-label"
                            placeholder="Feedback / Question / Request"
                            placeholderTextColor="#8b8e8f"
                            value={category}
                            onChangeText={setCategory}
                            autoCapitalize="words"
                            autoComplete="name"
                            textContentType="name"
                            returnKeyType="next"
                            maxLength={100}
                        />
                        <Text
                            nativeID="contact-message-label"
                            style={styles.label}
                        >
                            Message
                        </Text>

                        <TextInput
                            style={[styles.input, styles.messageInput]}
                            accessibilityLabelledBy="contact-message-label"
                            placeholder="Describe your question or feedback"
                            placeholderTextColor="#8b8e8f"
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            textAlignVertical="top"
                            maxLength={2000}
                        />

                        <Text style={styles.characterCount}>
                            {message.length}/2000
                        </Text>

                        {error ? (
                            <Text
                                style={styles.errorText}
                                accessibilityRole="alert"
                            >
                                {error}
                            </Text>
                        ) : null}

                        <Pressable
                            style={({pressed}) => [
                                styles.submitButton,
                                !isFormValid &&
                                styles.disabledButton,
                                pressed &&
                                isFormValid &&
                                styles.pressed,
                            ]}
                            onPress={handleSubmit}
                            disabled={!isFormValid}
                            accessibilityRole="button"
                            accessibilityState={{
                                disabled: !isFormValid,
                                busy: isSubmitting,
                            }}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#101415"/>
                            ) : (
                                <View style={styles.submitContent}>
                                    <Text style={styles.submitButtonText}>
                                        Send message
                                    </Text>

                                    <Ionicons
                                        name="send"
                                        size={18}
                                        color="#101415"
                                    />
                                </View>
                            )}
                        </Pressable>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
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
        minHeight: 50,
        backgroundColor: "#fd5900",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
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
    },
    disabledButton: {
        opacity: 0.45,
    },
    pressed: {
        opacity: 0.75,
    },
});