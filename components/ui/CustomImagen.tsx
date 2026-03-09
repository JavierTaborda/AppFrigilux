import { Image } from "expo-image";
import { memo, useState } from "react";
import { View } from "react-native";

type Props = {
  img: string;
  content?: "cover" | "contain" | "fill" | "none" | "scale-down";
};

const CustomImage = ({ img, content = "contain" }: Props) => {
  const [imageExists, setImageExists] = useState(true);
  const [loadingImage, setLoadingImage] = useState(true);

  return (
    <View className="w-full h-full">
      <Image
        source={{ uri: img }}
        contentFit={content}
        transition={100}
        cachePolicy="memory-disk"
        style={{ width: "100%", height: "100%" }}
        onLoadEnd={() => setLoadingImage(false)}
        onError={() => {
          requestAnimationFrame(() => {
            setImageExists(false);
            setLoadingImage(false);
          });
        }}
      />
      {/* {imageExists ? (
        <>
          {loadingImage && (
            <View className="absolute inset-0 bg-gray-200 dark:bg-gray-700" />
          )}
          <Image
            source={{ uri: img }}
            contentFit={content}
            transition={100}
            cachePolicy="memory-disk"
            style={{ width: "100%", height: "100%" }}
            onLoadEnd={() => setLoadingImage(false)}
            onError={() => {
              requestAnimationFrame(() => {
                setImageExists(false);
                setLoadingImage(false);
              });
            }}
          />
        </>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Ionicons name="image-outline" size={40} color="#999" />
        </View>
      )} */}
    </View>
  );
};

export default memo(CustomImage);
