import {API_BASE_URL} from "@/constants/api";
import {getSessionToken} from "@/services/athleteStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function acceptedUserDisclaimers(): Promise<void> {
    const storedAgreement =
        await AsyncStorage.getItem('pending_agreement');

    if (!storedAgreement) {
        return;
    }

    const token = await getSessionToken();

    if (!token) {
        return;
    }

    const agreementData = JSON.parse(storedAgreement) as {
        checkboxState: boolean;
        checkboxStateForBeta: boolean;
        createdAt: string;
    };

     await fetch(
        `${API_BASE_URL}/api/contactUs/userAcceptedBetaAndPrivacyStatement`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(agreementData),
        },
    );

    await AsyncStorage.removeItem('pending_agreement');
}