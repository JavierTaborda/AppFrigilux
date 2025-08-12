import { supabase } from "@/lib/supabase";

export async function getUserRole(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();
  if (error) {
 
    throw error;
  }

  return data?.role ?? null;
}


