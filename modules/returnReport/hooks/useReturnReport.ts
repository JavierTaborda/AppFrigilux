import { supabase } from "@/lib/supabase";
import { pickAndUloadImage } from "@/utils/uploadImage";
import { useState } from "react";


export function useProductDefect(userId: string) {
    const [loading, setLoading] = useState(false);

    const registerDefect = async (barcode: string, reason: string) => {
        try {
            setLoading(true);
            const imageUrl = await pickAndUloadImage(userId);

            const { error } = await supabase.from("product_defects").insert({
                barcode,
                reason,
                image_url: imageUrl,
                created_by: userId,
            });

            if (error) throw error;
            return true;
        } catch (err) {
            console.error("Error registrando defecto:", err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { registerDefect, loading };
}
