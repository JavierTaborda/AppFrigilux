import { supabase } from "@/lib/supabase";

export async function getUserRole(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single(); 
  if (error) {
    console.error("Error al obtener el rol del usuario:", error.message);
    return null;
  }

  return data?.role ?? null;
}


