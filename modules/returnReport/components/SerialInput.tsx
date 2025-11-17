import CustomTextInput from "@/components/inputs/CustomTextInput";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

type Props = {
  serial: string;
  setSerial: (text: string) => void;
  setShowScanner: (visible: boolean) => void;
  editable?: boolean;
};

const SerialInput: React.FC<Props> = ({
  serial,
  setSerial,
  setShowScanner,
  editable = true,
}) => {
  return (
    <View className="flex-row gap-2 items-center">
      <View className="flex-1">
        <CustomTextInput
          placeholder="Serial"
          value={serial}
          onChangeText={setSerial}
          editable={editable}
        />
      </View>
      <TouchableOpacity
        onPress={() => setShowScanner(true)}
        className="bg-primary dark:bg-dark-primary py-3 px-4 rounded-xl active:scale-95"
      >
        <Ionicons name="camera" size={22} color="white" />

      </TouchableOpacity>
    </View>
  );
};

export default SerialInput;
