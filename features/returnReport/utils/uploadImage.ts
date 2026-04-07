import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export async function pickAndUploadImage(fileUri: string, userId?: string, serial?: string) {
    try {
        const response = await fetch(fileUri);
        const arrayBuffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        console.log("Archivo seleccionado:", fileUri, "para usuario:", userId, "con serial:", serial);

       
        const name = serial ? `${serial}` : `${userId}${Date.now()}`;
        const filePath = `${userId || "anon"}/${name}.jpg`;

    
        //const response = await fetch(fileUri);
        const { data: uploadData, error } = await supabase.storage
            .from("return-reports")
            .upload(filePath, uint8Array, {
                cacheControl: "3600",
                upsert: true,
                contentType: "image/jpeg",
            });
 

        if (error) {
            console.error("Error real de Supabase:", error);
            throw error;
        }

        const { data } = supabase.storage
            .from("return-reports")
            .getPublicUrl(filePath);

        return { publicUrl: data.publicUrl, filePath };
    } catch (error) {
    
           // console.error("Error subiendo imagen:", error);
            throw error; 
    }
}


export async function pickImage(): Promise<string> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
        Alert.alert("Se necesita permiso para acceder a tus fotos.");
        return 'error';
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        //allowsEditing: true,
        quality: 0.5,
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
        return true;
    } catch (error) {
        console.error("Error eliminando imagen:", error);
        return false;
    }
}
export async function uploadMultipleImages(
    images: string[],
    userId?: string,
    serial?: string
) {
    const uploadedUrls: string[] = [];
    const uploadedPaths: string[] = [];

    let index = 0;
    for (const img of images) {

       // console.log("Subiendo imagen:", img, "para usuario:", userId, "con serial:", serial);
        const currentSerial = serial ? `${serial}_${index}` : undefined;
        const result = await pickAndUploadImage(img, userId, currentSerial);

        if (result) {
            uploadedUrls.push(result.publicUrl);
            uploadedPaths.push(result.filePath);
        }
        index++;
    }

    return { uploadedUrls, uploadedPaths };}
