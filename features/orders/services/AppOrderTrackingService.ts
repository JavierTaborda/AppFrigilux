import { supabase } from "@/lib/supabase";
import type { PedidoDTO } from "../../createOrder/interfaces/pedidoDTO";

export type AppOrderCreation = {
  id: string;
  order_number: number;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  source: string;
  order_snapshot: PedidoDTO | null;
  created_at: string;
};

type RegisterAppOrderInput = {
  orderNumber: number;
  userName?: string | null;
  orderSnapshot: PedidoDTO;
};

export const registerAppOrder = async ({
  orderNumber,
  userName,
  orderSnapshot,
}: RegisterAppOrderInput) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw userError ?? new Error("No hay una sesión de Supabase activa");
  }

  const { error } = await supabase.from("app_order_creations").upsert(
    {
      order_number: orderNumber,
      user_id: user.id,
      user_email: user.email ?? null,
      user_name: userName ?? null,
      order_snapshot: orderSnapshot,
    },
    { onConflict: "order_number" },
  );

  if (error) throw error;
};

export const getAppOrderCreations = async (): Promise<AppOrderCreation[]> => {
  const currentDate = new Date();
  const monthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const nextMonthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1,
  );

  const { data, error } = await supabase
    .from("app_order_creations")
    .select("id, order_number, user_id, user_email, user_name, source, order_snapshot, created_at")
    .gte("created_at", monthStart.toISOString())
    .lt("created_at", nextMonthStart.toISOString())
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
};
