import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";
import BottomModal from "@/components/ui/BottomModal";
import CustomFlatList from "@/components/ui/CustomFlatList";
import { formatDatedd_dot_MMM_yyyy } from "@/utils/datesFormat";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import AccountReceivableCard from "../components/AccountReceivableCard";
import { useAccountsReceivable } from "../hooks/useAccountsReceivable";
import type {
  AccountReceivable,
  AccountReceivableDetail,
  AccountReceivableFilters,
} from "../types/AccountsReceivable";

export default function SearchScreen() {
  const {
    accounts,
    filters,
    setFilters,
    loading,
    error,
    hasLoaded,
    loadAccounts,
    loadDetails,
    details,
    detailsLoading,
    detailsError,
  } = useAccountsReceivable();
  const { fontScale } = useWindowDimensions();
  const useCompactText = fontScale > 1.1;
  const [selectedClient, setSelectedClient] =
    useState<AccountReceivable | null>(null);

  const clients = useMemo(
    () => [...accounts].sort((a, b) => Number(b.monto) - Number(a.monto)),
    [accounts],
  );
  const clientBalance = useMemo(
    () => details.reduce((total, detail) => total + Number(detail.monto), 0),
    [details],
  );

  const updateFilter = (key: keyof AccountReceivableFilters, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const openClientDetails = useCallback(
    (client: AccountReceivable) => {
      setSelectedClient(client);
      void loadDetails(client.co_cli);
    },
    [loadDetails],
  );

  const renderClient = useCallback(
    ({ item }: { item: AccountReceivable }) => (
      <AccountReceivableCard
        account={item}
        onPress={() => openClientDetails(item)}
      />
    ),
    [openClientDetails],
  );

  const emptyMessage = error
    ? error
    : hasLoaded
      ? "No hay cuentas por cobrar pendientes."
      : "Carga los datos para consultar las cuentas por cobrar.";

  return (
    <ScreenSearchLayout
      searchText={filters.clientQuery}
      setSearchText={(value) => updateFilter("clientQuery", value)}
      placeholder="Buscar cliente por código o nombre"
      onFilterPress={() => undefined}
      showfilterButton={false}
      extrafilter={false}
      headerVisible={false}
    >
      <CustomFlatList
        data={clients}
        renderItem={renderClient}
        keyExtractor={(item) => item.co_cli}
        refreshing={loading}
        canRefresh
        handleRefresh={() => void loadAccounts()}
        showtitle
        title="Cuentas por cobrar de"
        subtitle={`${clients.length} ${clients.length === 1 ? "cliente" : "clientes"}`}
        resetScrollKey={filters.clientQuery}
        contentContainerStyle={{ paddingBottom: 110 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center px-8 py-16">
            <MaterialIcons
              name={error ? "error-outline" : "receipt-long"}
              size={44}
              color="#94a3b8"
            />
            <Text className="mt-3 text-center text-base text-mutedForeground dark:text-dark-mutedForeground">
              {emptyMessage}
            </Text>
            {error ? (
              <Pressable
                onPress={() => void loadAccounts()}
                className="mt-4 rounded-xl bg-primary px-5 py-3 dark:bg-dark-primary"
              >
                <Text className="font-bold text-white">Reintentar</Text>
              </Pressable>
            ) : null}
          </View>
        }
      />

      <BottomModal
        visible={selectedClient !== null}
        onClose={() => setSelectedClient(null)}
        heightPercentage={0.86}
      >
        {selectedClient ? (
          <View className="flex-1  pt-4">
            <View className="mb-4 flex-row items-center gap-3 border-b border-slate-200 pb-4 dark:border-slate-700">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary dark:bg-dark-primary">
                <MaterialIcons name="receipt-long" size={25} color="#fff" />
              </View>
              <View className="flex-1">
                <Text
                  numberOfLines={1}
                  className="text-lg font-extrabold text-foreground dark:text-dark-foreground"
                >
                  {selectedClient.cli_des.trim()}
                </Text>
                <Text className="mt-1 text-sm text-foreground dark:text-dark-mutedForeground">
                  Cliente {selectedClient.co_cli.trim()} · {details.length}{" "}
                  {details.length === 1 ? "documento" : "documentos"}
                </Text>
                <Text className="mt-1 text-sm text-foreground dark:text-dark-foreground">
                  Saldo{"  "}
                  <Text className="text-xl font-bold text-primary dark:text-dark-primary">
                    {totalVenezuela(clientBalance)} {currencyDollar}
                  </Text>
                </Text>
              </View>
            </View>

            {detailsLoading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator color="#64748b" />
              </View>
            ) : detailsError ? (
              <View className="flex-1 items-center justify-center px-6">
                <Text className="text-center text-mutedForeground dark:text-dark-mutedForeground">
                  {detailsError}
                </Text>
                <Pressable
                  onPress={() => void loadDetails(selectedClient.co_cli)}
                  className="mt-4 rounded-xl bg-primary px-5 py-3 dark:bg-dark-primary"
                >
                  <Text className="font-bold text-white">Reintentar</Text>
                </Pressable>
              </View>
            ) : (
              <FlatList
                data={details}
                keyExtractor={(item, index) =>
                  `${item.tipo_doc}-${item.nro_doc}-${index}`
                }
                contentContainerStyle={{ paddingTop: 14, paddingBottom: 30 }}
                ListEmptyComponent={
                  <View className="items-center px-6 py-12">
                    <MaterialIcons name="task-alt" size={40} color="#94a3b8" />
                    <Text className="mt-3 text-center text-base font-semibold text-foreground dark:text-dark-foreground">
                      Este cliente no tiene documentos pendientes
                    </Text>
                    <Text className="mt-1 text-center text-sm text-mutedForeground dark:text-dark-mutedForeground">
                      La cuenta está al día.
                    </Text>
                  </View>
                }
                renderItem={({ item }) => (
                  <DetailRow detail={item} useCompactText={useCompactText} />
                )}
              />
            )}
          </View>
        ) : null}
      </BottomModal>
    </ScreenSearchLayout>
  );
}

function DetailRow({
  detail,
  useCompactText,
}: {
  detail: AccountReceivableDetail;
  useCompactText: boolean;
}) {
  return (
    <View className="mb-3 rounded-2xl border border-slate-200 bg-componentbg p-4 shadow-sm shadow-slate-200/50 dark:border-slate-700 dark:bg-dark-componentbg dark:shadow-none">
      {/* Header */}
      <View className="flex-row items-start justify-between gap-1">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-[12px] font-bold uppercase tracking-wider text-foreground dark:text-dark-foreground">
              {detail.tipo_doc}-{detail.nro_doc}
            </Text>
            <View className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            <Text className="text-[12px] text-mutedForeground dark:text-dark-mutedForeground">
              {formatDatedd_dot_MMM_yyyy(detail.fec_emis)}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text
            className={`mt-0.5 text-right text-lg font-extrabold ${Number(detail.monto) < 0 ? "text-error dark:text-dark-error" : "text-primary dark:text-dark-primary"}`}
            numberOfLines={1}
          >
            {totalVenezuela(detail.monto)} {currencyDollar}
          </Text>
        </View>
      </View>

      {detail.origen === "E" && detail.origen_d ? (
        <View className="mt-0.5 flex-row items-center gap-1 rounded-xl bg-primary/10 px-3 py-2.5 dark:bg-dark-primary/20">
          <View className="h-7 w-7 items-center justify-center rounded-full bg-primary/15 dark:bg-dark-primary/25">
            <MaterialIcons name="task" size={15} color="#0f766e" />
          </View>
          <Text
            className="flex-1 text-sm font-semibold text-primary dark:text-dark-primary"
            numberOfLines={2}
          >
            NOTA DE ENTREGA {detail.origen_d}
          </Text>
        </View>
      ) : null}
      {detail.tipo_doc.trim() === "FACT" ? (
        <View className="mt-0.5 flex-row items-center gap-1 rounded-xl bg-warning/10 px-3 py-2.5 dark:bg-dark-warning/20">
          <View className="h-7 w-7 items-center justify-center rounded-full bg-warning/15 dark:bg-dark-warning/25">
            <MaterialIcons name="task" size={15} color="#b45309" />
          </View>
          <Text
            className="flex-1 text-sm font-semibold text-foreground dark:text-dark-f"
            numberOfLines={2}
          >
            FACTURA {detail.nro_doc}
          </Text>
        </View>
      ) : null}

      {detail.tipo_doc.trim() === "N/CR" ? (
        <View className="mt-0.5 flex-row items-center gap-1 rounded-xl bg-tertiary/10 px-3 py-2.5 dark:bg-dark-tertiary/20">
          <View className="h-7 w-7 items-center justify-center rounded-full bg-tertiary/15 dark:bg-dark-tertiary/25">
            <MaterialIcons name="task" size={15} color="#7c3aed" />
          </View>
          <Text
            className="flex-1 text-sm font-semibold text-dark-tertiary dark:text-dark-tertiary"
            numberOfLines={2}
          >
            NOTA DE CRÉDITO {detail.nro_doc}
          </Text>
        </View>
      ) : null}

      {detail.observa ? (
        <View className="mt-0.5 border-t border-slate-100 pt-1 dark:border-slate-700">
          <Text className="mt-1 text-sm  leading-5 text-foreground dark:text-dark-foreground">
            {detail.observa}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
