import CustomDateTimePicker from "@/components/inputs/CustomDateTimePicker";
import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";
import BottomModal from "@/components/ui/BottomModal";
import CustomFlatList from "@/components/ui/CustomFlatList";
import FilterModal from "@/components/ui/FilterModal";
import { useAuthStore } from "@/stores/useAuthStore";
import { appTheme } from "@/utils/appTheme";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import { useRefreshControl } from "@/utils/userRefreshControl";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AppOrderCreation,
  getAppOrderCreations,
} from "../services/AppOrderTrackingService";

export default function AppOrderTrackingScreen() {
  const { role } = useAuthStore();
  const [orders, setOrders] = useState<AppOrderCreation[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AppOrderCreation | null>(
    null,
  );
  const [searchText, setSearchText] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [detailFilter, setDetailFilter] = useState<"all" | "with" | "without">(
    "all",
  );
  const [pendingDetailFilter, setPendingDetailFilter] = useState<
    "all" | "with" | "without"
  >("all");
  const [sellerFilter, setSellerFilter] = useState<string>();
  const [pendingSellerFilter, setPendingSellerFilter] = useState<string>();
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [pendingStartDate, setPendingStartDate] = useState<Date | undefined>();
  const [pendingEndDate, setPendingEndDate] = useState<Date | undefined>();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const { refreshing, canRefresh, cooldown, wrapRefresh, cleanup } =
    useRefreshControl(10);

  useEffect(() => cleanup, [cleanup]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await getAppOrderCreations());
    } catch {
      Alert.alert(
        "Error",
        "No se pudo consultar el registro de pedidos de la app.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    wrapRefresh(
      async () => setOrders(await getAppOrderCreations()),
      () =>
        Alert.alert(
          "Error",
          "No se pudo actualizar el registro de pedidos de la app.",
        ),
    );
  }, [wrapRefresh]);

  useFocusEffect(
    useCallback(() => {
      if (role === "1") loadOrders();
    }, [loadOrders, role]),
  );

  const filteredOrders = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return orders.filter((order) => {
      const snapshot = order.order_snapshot;
      const hasDetail = !!snapshot;
      const matchesDetail =
        detailFilter === "all" ||
        (detailFilter === "with" && hasDetail) ||
        (detailFilter === "without" && !hasDetail);
      const matchesSeller = !sellerFilter || snapshot?.co_ven === sellerFilter;
      const createdAt = new Date(order.created_at).getTime();
      const matchesStartDate =
        !startDate || createdAt >= new Date(startDate).setHours(0, 0, 0, 0);
      const matchesEndDate =
        !endDate || createdAt <= new Date(endDate).setHours(23, 59, 59, 999);

      if (
        !matchesDetail ||
        !matchesSeller ||
        !matchesStartDate ||
        !matchesEndDate
      )
        return false;
      if (!query) return true;

      const searchableText = [
        order.order_number,
        order.user_name,
        order.user_email,
        snapshot?.nombre,
        snapshot?.co_cli,
        snapshot?.co_ven,
        ...(snapshot?.reng_ped?.flatMap((line) => [
          line.co_art,
          line.des_art,
        ]) ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [detailFilter, endDate, orders, searchText, sellerFilter, startDate]);

  const sellerOptions = useMemo(
    () =>
      Array.from(
        new Set(
          orders
            .map((order) => order.order_snapshot?.co_ven?.trim())
            .filter((seller): seller is string => Boolean(seller)),
        ),
      ).sort(),
    [orders],
  );

  if (role !== "1") {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6 dark:bg-dark-background">
        <Ionicons name="lock-closed-outline" size={42} color="#9ca3af" />
        <Text className="mt-3 text-center text-foreground dark:text-dark-foreground">
          Esta pantalla está disponible solo para administradores.
        </Text>
      </View>
    );
  }

  if (loading) return <AppOrderTrackingSkeleton />;

  return (
    <>
      <ScreenSearchLayout
        searchText={searchText}
        setSearchText={setSearchText}
        placeholder="Pedido, cliente, usuario o artículo..."
        onFilterPress={() => {
          setPendingDetailFilter(detailFilter);
          setPendingSellerFilter(sellerFilter);
          setPendingStartDate(startDate);
          setPendingEndDate(endDate);
          setFilterVisible(true);
        }}
        filterCount={
          (detailFilter === "all" ? 0 : 1) +
          (sellerFilter ? 1 : 0) +
          (startDate ? 1 : 0) +
          (endDate ? 1 : 0)
        }
        headerVisible={false}
      >
        <CustomFlatList
          data={filteredOrders}
          renderItem={({ item }) =>
            (() => {
              const snapshot = item.order_snapshot;
              const exchangeRate = getExchangeRate(snapshot?.tasa);

              return (
                <Pressable
                  onPress={() => setSelectedOrder(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Abrir detalle del pedido ${item.order_number}`}
                  className="mb-2 rounded-2xl border border-gray-200 bg-componentbg p-3 active:opacity-80 dark:border-gray-700 dark:bg-dark-componentbg"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="min-w-0 flex-1">
                      <Text className="mt-0.5 text-2xl font-bold leading-7 text-foreground dark:text-dark-foreground">
                        Pedido #{snapshot?.fact_num ?? item.order_number}
                      </Text>
                    </View>
                    <View className="ml-3 items-end">
                      <View className="flex-row items-center rounded-full bg-green-100 px-2.5 py-0.5 dark:bg-green-900/30">
                        <Ionicons
                          name="trending-up-outline"
                          size={16}
                          color="#16a34a"
                        />
                        <Text className="ml-1 text-[12px] font-bold text-green-700 dark:text-green-400">
                          {totalVenezuela(exchangeRate)} Bs/$
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="mt-2 rounded-xl bg-gray-100 p-2 dark:bg-gray-800">
                    <View className="flex-row justify-between gap-3">
                      <CardField label="Cliente" value={snapshot?.co_cli} />
                      <CardField
                        label="Cod Vendedor"
                        value={snapshot?.co_ven}
                      />
                    </View>
                    <View className="mt-1.5 flex-row justify-between gap-3">
                      <CardField
                        label="Vendedor"
                        value={item.user_name?.trim() || "Sin nombre"}
                      />
                      <CardField
                        label="Fecha y hora"
                        value={formatOrderDateTime(
                          snapshot?.fec_emis || item.created_at,
                        )}
                      />
                    </View>
                  </View>

                  <View className="mt-2 flex-row justify-between gap-2">
                    <CardAmount
                      label="Bruto"
                      value={snapshot?.tot_bruto}
                      exchangeRate={exchangeRate}
                    />
                    <CardAmount
                      label="IVA"
                      value={snapshot?.iva}
                      exchangeRate={exchangeRate}
                    />
                    <CardAmount
                      label="Neto"
                      value={snapshot?.tot_neto}
                      exchangeRate={exchangeRate}
                    />
                  </View>

                  {snapshot?.reng_ped?.map((line, index) => (
                    <View
                      key={`${line.reng_num}-${index}`}
                      className="mt-2 border-t border-gray-200 pt-2 dark:border-gray-700"
                    >
                      <Text className="font-semibold text-foreground dark:text-dark-foreground">
                        {line.co_art?.trim() || "Artículo sin código"}
                      </Text>
                      <View className="mt-1 flex-row flex-wrap justify-between gap-1">
                        <CardField
                          label="Cantidad"
                          value={String(line.total_art ?? 0)}
                        />
                        <CardField
                          label="Precio"
                          value={totalVenezuela(line?.prec_vta2!)}
                        />
                        <CardField label="Descuento" value={line.porc_desc} />
                        <CardField
                          label="Total"
                          value={formatCurrency(line.reng_neto, exchangeRate)}
                        />
                      </View>
                    </View>
                  ))}
                </Pressable>
              );
            })()
          }
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          canRefresh={canRefresh}
          handleRefresh={handleRefresh}
          cooldown={cooldown}
          showtitle={true}
          title={`${filteredOrders.length} ${filteredOrders.length === 1 ? "Pedido" : "Pedidos"}`}
          ListEmptyComponent={
            <Text className="py-10 text-center text-foreground dark:text-dark-foreground">
              {orders.length === 0
                ? "Todavía no hay pedidos registrados desde la app."
                : "No se encontraron pedidos con esos criterios."}
            </Text>
          }
        />
      </ScreenSearchLayout>

      <FilterModal
        visible={filterVisible}
        onClose={() => {
          setShowStartPicker(false);
          setShowEndPicker(false);
          setFilterVisible(false);
        }}
        onClean={() => {
          setPendingDetailFilter("all");
          setPendingSellerFilter(undefined);
          setPendingStartDate(undefined);
          setPendingEndDate(undefined);
          setShowStartPicker(false);
          setShowEndPicker(false);
        }}
        onApply={() => {
          setDetailFilter(pendingDetailFilter);
          setSellerFilter(pendingSellerFilter);
          setStartDate(pendingStartDate);
          setEndDate(pendingEndDate);
          setShowStartPicker(false);
          setShowEndPicker(false);
          setFilterVisible(false);
        }}
        title="Filtrar pedidos"
      >
        <ScrollView
          className="bg-background dark:bg-dark-background"
          contentContainerClassName="px-4 pb-4"
          showsVerticalScrollIndicator
          nestedScrollEnabled
        >
          <Text className="mb-1 font-medium text-mutedForeground dark:text-dark-mutedForeground">
            Desde
          </Text>
          <TouchableOpacity
            className="mb-3 rounded-xl bg-muted p-3 dark:bg-dark-muted"
            onPress={() => setShowStartPicker(true)}
          >
            <Text className="text-foreground dark:text-dark-foreground">
              {pendingStartDate
                ? pendingStartDate.toLocaleDateString()
                : "Seleccionar fecha"}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <CustomDateTimePicker
              value={pendingStartDate || new Date()}
              onChange={(_, selectedDate) => {
                if (selectedDate) setPendingStartDate(selectedDate);
              }}
              onClose={() => setShowStartPicker(false)}
            />
          )}

          <Text className="mb-1 font-medium text-mutedForeground dark:text-dark-mutedForeground">
            Hasta
          </Text>
          <TouchableOpacity
            className="mb-3 rounded-xl bg-muted p-3 dark:bg-dark-muted"
            onPress={() => setShowEndPicker(true)}
          >
            <Text className="text-foreground dark:text-dark-foreground">
              {pendingEndDate
                ? pendingEndDate.toLocaleDateString()
                : "Seleccionar fecha"}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <CustomDateTimePicker
              value={pendingEndDate || new Date()}
              onChange={(_, selectedDate) => {
                if (selectedDate) setPendingEndDate(selectedDate);
              }}
              onClose={() => setShowEndPicker(false)}
            />
          )}

          <Text className="mb-3 text-sm font-semibold text-foreground dark:text-dark-foreground">
            Detalle guardado
          </Text>
          <View className="gap-2">
            {(
              [
                ["all", "Todos los pedidos"],
                ["with", "Con detalle"],
                ["without", "Sin detalle"],
              ] as const
            ).map(([value, label]) => (
              <Pressable
                key={value}
                onPress={() => setPendingDetailFilter(value)}
                className={`flex-row items-center rounded-xl border p-3 ${
                  pendingDetailFilter === value
                    ? "border-primary bg-primary/10 dark:border-dark-primary dark:bg-dark-primary/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <Ionicons
                  name={
                    pendingDetailFilter === value
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={20}
                  color={pendingDetailFilter === value ? "#16a34a" : "#9ca3af"}
                />
                <Text className="ml-3 text-foreground dark:text-dark-foreground">
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text className="mb-3 mt-4 text-sm font-semibold text-foreground dark:text-dark-foreground">
            Vendedor
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {["Todos los vendedores", ...sellerOptions].map((seller) => {
              const value =
                seller === "Todos los vendedores" ? undefined : seller;
              const selected = pendingSellerFilter === value;

              return (
                <Pressable
                  key={seller}
                  onPress={() => setPendingSellerFilter(value)}
                  className={`rounded-full border px-4 py-2 ${
                    selected
                      ? "border-primary bg-primary dark:border-dark-primary dark:bg-dark-primary"
                      : "border-muted"
                  }`}
                >
                  <Text
                    className={
                      selected
                        ? "text-sm text-white"
                        : "text-sm text-foreground dark:text-dark-foreground"
                    }
                  >
                    {seller}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </FilterModal>

      <AppOrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
}

function AppOrderDetailModal({
  order,
  onClose,
}: {
  order: AppOrderCreation | null;
  onClose: () => void;
}) {
  const snapshot = order?.order_snapshot;
  const exchangeRate = getExchangeRate(snapshot?.tasa);

  return (
    <BottomModal visible={!!order} onClose={onClose} heightPercentage={0.85}>
      {order && snapshot ? (
        <>
          <View className="mb-4 flex-row items-center">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/40">
              <Ionicons
                name="phone-portrait-outline"
                size={23}
                color={appTheme.primary.DEFAULT}
              />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-xs font-semibold uppercase tracking-wide text-primary dark:text-green-400">
                Pedido creado desde la app
              </Text>
              <Text className="mt-0.5 text-2xl font-bold text-foreground dark:text-dark-foreground">
                #{order.order_number}
              </Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-4 rounded-2xl bg-primary p-4 dark:bg-dark-primary">
              <Text className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                Cliente
              </Text>
              <Text className="mt-1 text-lg font-bold text-white">
                {snapshot.nombre || "Cliente sin nombre"}
              </Text>
              <Text className="mt-0.5 text-sm text-white/80">
                {snapshot.co_cli || "Sin código"}
              </Text>
              <View className="mt-4 border-t border-white/20 pt-2">
                <Text className="text-sm  font-normal text-white/70">
                  Total del pedido
                </Text>
                <Text className="mt-1 text-3xl font-bold text-white">
                  {formatCurrency(snapshot.tot_neto, exchangeRate)}
                </Text>
              </View>
            </View>

            <View className="mb-4 rounded-2xl border border-gray-200 bg-componentbg p-4 dark:border-gray-700 dark:bg-dark-componentbg">
              <Text className="mb-3 text-base font-bold text-foreground dark:text-dark-foreground">
                Información del pedido
              </Text>
              <DetailRow
                label="Creado por "
                value={order.user_name || "No especificado"}
              />
              <DetailRow
                label="Código el vendedor"
                value={snapshot.co_ven || "No especificado"}
              />
              <DetailRow
                label="Dirección"
                value={snapshot.dir_ent || "No especificada"}
              />
              <DetailRow
                label="Condición"
                value={snapshot.condicion || "No especificada"}
              />
              <DetailRow
                label="Comentario"
                value={snapshot.comentario || "Sin comentario"}
              />
            </View>

            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
                Artículos
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {snapshot.reng_ped?.length ?? 0} renglones
              </Text>
            </View>
            {snapshot.reng_ped?.map((line, index) => {
              const image = (line as typeof line & { img?: string | null }).img;
              return (
                <View
                  key={`${line.reng_num}-${index}`}
                  className="mb-2 flex-row items-center rounded-2xl border border-gray-200 bg-componentbg p-3 dark:border-gray-700 dark:bg-dark-componentbg"
                >
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      className="mr-3 h-16 w-16 rounded-lg bg-gray-200"
                    />
                  ) : (
                    <View className="mr-3 h-16 w-16 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                      <Ionicons
                        name="image-outline"
                        size={24}
                        color="#9ca3af"
                      />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground dark:text-dark-foreground">
                      {line.co_art || "Artículo sin código"}
                    </Text>
                    <Text
                      className="text-sm text-gray-500 dark:text-gray-400"
                      numberOfLines={2}
                    >
                      {line.des_art || "Sin descripción"}
                    </Text>
                    <View className="mt-2 flex-row items-center justify-between">
                      <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Cantidad: {line.total_art ?? 0}
                      </Text>
                      <Text className="text-sm font-bold text-primary dark:text-dark-primary">
                        {formatCurrency(line.reng_neto, exchangeRate)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}

            <View className="mt-3 rounded-2xl bg-green-600 p-4">
              <DetailRow
                label="Subtotal"
                value={formatCurrency(snapshot.tot_bruto, exchangeRate)}
                light
              />
              <DetailRow
                label="IVA"
                value={formatCurrency(snapshot.iva, exchangeRate)}
                light
              />
            </View>
          </ScrollView>
        </>
      ) : (
        <Text className="p-4 text-center text-foreground dark:text-dark-foreground">
          Este pedido no tiene un detalle guardado.
        </Text>
      )}
    </BottomModal>
  );
}

function getExchangeRate(value: string | number | null | undefined) {
  const exchangeRate = Number(value ?? 0);
  return exchangeRate > 0 ? exchangeRate : 1;
}

function formatOrderDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Sin fecha" : date.toLocaleString();
}

function CardField({ label, value }: { label: string; value?: string }) {
  return (
    <View className="min-w-0 flex-1">
      <Text className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400">
        {label}
      </Text>
      <Text
        className="mt-0.5 text-sm font-semibold text-foreground dark:text-dark-foreground"
        numberOfLines={1}
      >
        {value?.trim() || "-"}
      </Text>
    </View>
  );
}

function CardAmount({
  label,
  value,
  exchangeRate,
}: {
  label: string;
  value?: number;
  exchangeRate: number;
}) {
  return (
    <View className="flex-1">
      <Text className="text-[10px] font-semibold uppercase text-gray-500 dark:text-gray-400">
        {label}
      </Text>
      <Text className="mt-0.5 text-sm font-bold text-primary dark:text-dark-primary">
        {formatCurrency(value, exchangeRate)}
      </Text>
    </View>
  );
}

function convertToDollars(
  value: string | number | null | undefined,
  exchangeRate: string | number | null | undefined,
) {
  return Number(value ?? 0) / getExchangeRate(exchangeRate);
}

function formatCurrency(
  value: string | number | null | undefined,
  exchangeRate = 1,
) {
  const total = convertToDollars(value, exchangeRate).toFixed(2);
  return `${totalVenezuela(total)} ${currencyDollar}`;
}

function DetailRow({
  label,
  value,
  light = false,
}: {
  label: string;
  value: string;
  light?: boolean;
}) {
  return (
    <View className="mb-2 flex-row justify-between gap-3">
      <Text
        className={
          light
            ? "text-sm text-white/80"
            : "text-sm text-gray-500 dark:text-gray-400"
        }
      >
        {label}
      </Text>
      <Text
        className={
          light
            ? "flex-1 text-right text-md font-semibold text-white"
            : "flex-1 text-right text-md font-semibold text-foreground dark:text-dark-foreground"
        }
      >
        {value}
      </Text>
    </View>
  );
}

function AppOrderTrackingSkeleton() {
  return (
    <View className="flex-1 bg-background px-4 pt-5 dark:bg-dark-background">
      <View className="mb-2 h-8 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700" />
      <View className="mb-5 h-4 w-11/12 rounded bg-gray-200 dark:bg-gray-700" />

      {Array.from({ length: 3 }).map((_, index) => (
        <View
          key={index}
          className="mb-3 rounded-xl border border-gray-200 bg-componentbg p-4 dark:border-gray-700 dark:bg-dark-componentbg"
        >
          <View className="flex-row items-center justify-between">
            <View className="h-6 w-2/5 rounded bg-gray-200 dark:bg-gray-700" />
            <View className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
          </View>
          <View className="mt-3 h-5 w-3/5 rounded bg-gray-200 dark:bg-gray-700" />
          <View className="mt-2 h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-700" />
        </View>
      ))}
    </View>
  );
}
