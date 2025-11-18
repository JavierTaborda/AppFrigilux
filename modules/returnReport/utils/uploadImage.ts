import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";

export async function pickAndUploadImage(fileUri: string, userId?: string) {
    try {
        const response = await fetch(fileUri);
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const filePath = `${userId || "anon"}/${Date.now()}.jpg`;

        const { error } = await supabase.storage
            .from("return-reports")
            .upload(filePath, uint8Array, {
                cacheControl: "3600",
                upsert: false,
                contentType: "image/jpeg",
            });

        if (error) throw error;

        const { data } = supabase.storage
            .from("return-reports")
            .getPublicUrl(filePath);

        return { publicUrl: data.publicUrl, filePath };
    } catch (error) {
        console.error("Error subiendo imagen:", error);
        return null;
    }
}


export async function pickImage(): Promise<string> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
        alert("Se necesita permiso para acceder a tus fotos.");
        return 'error';
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
    });

    if (!result.canceled) {
        return result.assets[0].uri;
    }

    return 'error';
}
export async function deleteImage(filePath: string) {
    try {
        const { error } = await supabase.storage
            .from("return-reports")
            .remove([filePath]); 

        if (error) throw error;

        console.log("Imagen eliminada correctamente:", filePath);
        return true;
    } catch (error) {
        console.error("Error eliminando imagen:", error);
        return false;
    }
}
