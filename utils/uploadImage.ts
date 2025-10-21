import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import * as ImagePicker from "expo-image-picker";

export async function pickAndUloadImage(UserId: string) {

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:['images'],
        allowsEditing:true,
        quality:0.7,
        base64:true,
    });

    console.log(result);

    if (result.canceled) return null;

    const file=result.assets[0];

    const filePath=`${UserId}/${Date.now()}.jpg`;

    const {error} = await supabase.storage
        .from("return_reports")
        .upload(filePath, decode(file.base64!),{
            contentType:"image/jpeg",
            upsert:false,
        });

        if (error) throw error;

    const {data}= supabase.storage.from("return_reports").getPublicUrl(filePath);
    return data.publicUrl;

};
