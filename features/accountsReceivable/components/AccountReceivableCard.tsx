import { appTheme } from "@/utils/appTheme";
import { currencyDollar, totalVenezuela } from "@/utils/moneyFormat";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { Pressable, Text, View } from "react-native";
import type { AccountReceivable } from "../types/AccountsReceivable";

type Props = {
  account: AccountReceivable;
  onPress: () => void;
};

export default function AccountReceivableCard({ account, onPress }: Props) {
  const hasCredit = Number(account.mont_cre) > 0;

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 rounded-2xl border border-slate-200 bg-componentbg px-4 py-4 dark:border-slate-700 dark:bg-dark-componentbg"
    >
      <View className="flex-row items-start gap-3">
        <View className="flex-1">
          <Text
            numberOfLines={2}
            className="text-base font-bold text-foreground dark:text-dark-foreground"
          >
            {account.co_cli.trim()} - {account.cli_des.trim()}
          </Text>

          {account.moneda ? (
            <Text className="mt-1 text-xs font-bold text-primary dark:text-dark-primary">
              Moneda: {account.moneda}
            </Text>
          ) : null}
        </View>
        <MaterialIcons name="chevron-right" size={22} color="#94a3b8" />
      </View>
      <View className="mt-4 flex-row gap-2">
        {hasCredit ? (
          <Metric label="Crédito" value={account.mont_cre} />
        ) : (
          <Metric label="Crédito" value="N/A" />
        )}
        <Metric label="Saldo" value={account.monto} emphasis />

        <Metric
          label="Disponible"
          value={Math.max(0, Number(account.diferencia))}
          valueColor={appTheme.tertiary.DEFAULT}
        />
      </View>
    </Pressable>
  );
}

function Metric({
  label,
  value,
  valueColor,
  emphasis = false,
  danger = false,
}: {
  label: string;
  value: number | string;
  valueColor?: string;
  emphasis?: boolean;
  danger?: boolean;
}) {
  return (
    <View className="min-w-0 flex-1 rounded-xl bg-background px-2 py-2 dark:bg-dark-background">
      <Text className="text-[12px]  text-mutedForeground dark:text-dark-mutedForeground">
        {label}
      </Text>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        className={`mt-1 text-[16px] font-bold ${danger ? "text-error dark:text-dark-error" : emphasis ? "text-primary dark:text-dark-primary" : "text-foreground dark:text-dark-foreground"}`}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {typeof value === "string" && value === "N/A"
          ? value
          : ` ${totalVenezuela(value)} ${currencyDollar}`}
      </Text>
    </View>
  );
}
