import {getSessionToken} from "@/services/athleteStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_BASE_URL} from "@/constants/api";

export async function acceptedUserDisclaimers(): Promise<void> {

    const data: string = await AsyncStorage.getItem('pending_agreement') ?? "Empty";
    const token = await getSessionToken();

    if(!data)return Promise.reject(new Error('Not authorized'));

    const agreementData = JSON.parse(data) as {
        checkboxState: boolean,
        checkboxStateForBeta: boolean,
    }

    console.log(agreementData);
    console.log(token);
    await fetch(`${API_BASE_URL}/api/contactUs/userAcceptedBetaAndPrivacyStatement`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
        },
        body: JSON.stringify(agreementData)
    })
}