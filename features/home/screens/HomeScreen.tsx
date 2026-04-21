import ErrorView from "@/components/ui/ErrorView";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { ScrollView } from "react-native";
import HomePrincipalScreen from "../components/HomePricipalScreen";
import HomeSkeleton from "../components/HomeSkeleton";
import ReturnHome from "../components/ReturnHome";
import { useHomeScreen } from "../hooks/useHomeScreen";

export default function HomeScreen() {
  const { session, name, role } = useAuthStore();
  const { isDark } = useThemeStore();
  const {
    loading,
    error,
    totalsByDate,
    labels,
    values,
    dotLabels,
    totalPedidos,
    totalNeto,
    chartText,
    getData,
  } = useHomeScreen();

  if (loading) {
    return <HomeSkeleton />;
  }

  if (error) {
    return <ErrorView error={error} getData={getData} />;
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
      keyboardShouldPersistTaps="handled"
      className="bg-background dark:bg-dark-background px-4 pt-2"
    >
      {role != "8" ? (
        <HomePrincipalScreen
          name={name}
          totalPedidos={totalPedidos}
          totalNeto={totalNeto}
          chartText={chartText}
          labels={labels}
          values={values}
          dotLabels={dotLabels}
          isDark={isDark}
        />
      ) : (
        <ReturnHome name={name} />
      )}
    </ScrollView>
  );
}
