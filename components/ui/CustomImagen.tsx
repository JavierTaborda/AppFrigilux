import { Image } from "expo-image";
import { memo } from "react";
import { View } from "react-native";

const PLACEHOLDER_BLURHASH = "IsL}BEof~q";

type Props = {
  img: string;
  content?: "cover" | "contain" | "fill" | "none" | "scale-down";
};

const CustomImage = ({ img, content = "contain" }: Props) => {
  return (
    <View className="w-full h-full">
      <Image
        source={{ uri: img }}
        contentFit={content}
        transition={150}
        cachePolicy="memory-disk"
        //placeholder={{ blurhash: PLACEHOLDER_BLURHASH }}
        placeholder={require("@/assets/images/image-outline.png")}
        placeholderContentFit="cover"
        recyclingKey={img}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
};

export default memo(CustomImage);
