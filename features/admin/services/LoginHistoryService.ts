import { supabase } from "@/lib/supabase";
import { getLoginHistoryDisabled } from "@/utils/loginHistoryPreference";

export type LoginMethod = "password" | "email_otp" | "sms_otp";

export type LoginHistoryEntry = {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  role: string | null;
  method: LoginMethod;
  platform: string | null;
  created_at: string;
};

export async function recordLoginEvent(method: LoginMethod): Promise<void> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw userError ?? new Error("No hay una sesión de Supabase activa");
  }

  if (await getLoginHistoryDisabled(user.id)) return;

  const { error } = await supabase.from("login_history").insert({
    user_id: user.id,
    method,
  });

  if (error) throw error;
}

export async function getLoginHistory(
  startDate?: Date,
  endDate?: Date,
): Promise<LoginHistoryEntry[]> {
  const rangeStart = startDate ? startOfDay(startDate) : new Date(0);
  const rangeEnd = endDate ? endOfDay(endDate) : new Date();

  const { data, error } = await supabase
    .from("login_history")
    .select(
      "id, user_id, user_email, user_name, role, method, platform, created_at",
    )
    .gte("created_at", rangeStart.toISOString())
    .lte("created_at", rangeEnd.toISOString())
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function endOfDay(value: Date) {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate(),
    23,
    59,
    59,
    999,
  );
}
