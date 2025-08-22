import { Text, View } from "react-native";
export default function SettingsScreen() {

  return (

    <View className="flex-1 items-center  gap-5 justify-center bg-background dark:bg-dark-background ">

      <Text className="text-foreground dark:text-dark-foreground text-xl mb-4">
        Settings
      </Text>

    </View>
  );
}