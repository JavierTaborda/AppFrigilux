import { ScrollView, View } from "react-native";

const CreateOrderSkeleton = ({ columns = 2 }) => {
  // Creamos un array de filas (por ejemplo, 6 filas) para llenar la pantalla
  const rows = Array.from({ length: 6 });
  // Creamos un array basado en el número de columnas
  const cols = Array.from({ length: columns });

  return (
    <ScrollView className="flex-1 px-5 py-2 rounded-t-3xl bg-background dark:bg-dark-background">
      {rows.map((_, rowIndex) => (
        <View
          key={`row-${rowIndex}`}
          className="flex-row gap-2.5 items-center justify-between mb-4"
        >
          {cols.map((_, colIndex) => (
            <View
              key={`col-${colIndex}`}
              style={{ width: `${100 / columns - 2}%` }}
              className="h-40 bg-gray-300 dark:bg-gray-700 rounded-2xl animate-pulse"
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default CreateOrderSkeleton;
