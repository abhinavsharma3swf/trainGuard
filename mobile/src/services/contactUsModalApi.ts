import { API_BASE_URL } from "@/constants/api";
import {ContactFormData} from "@/components/ContactModal";
import {getSessionToken} from "@/services/athleteStorage";


    export async function submitContactUsModalData(formData: ContactFormData): Promise<ContactFormData> {
        const token = await getSessionToken();
        if(!token) {
            throw new Error("Missing token");
        }
        const response = await fetch (`${API_BASE_URL}/api/contactUs`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });
        return response.json();
    }