import { Image } from "expo-image";
import { memo } from "react";

const PLACEHOLDER_BLURHASH = "IsL}BEof~q";

type Props = {
  img: string;
  content?: "cover" | "contain" | "fill" | "none" | "scale-down";
  recyclingKey?: string;
};

const CustomImage = ({ img, content = "contain", recyclingKey }: Props) => {
  return (
    <Image
      source={{ uri: img }}
      contentFit={content}
      transition={150}
      cachePolicy="memory-disk"
      //placeholder={{ blurhash: PLACEHOLDER_BLURHASH }}
      placeholder={require("@/assets/images/image-outline.png")}
      placeholderContentFit="cover"
      recyclingKey={recyclingKey}
      style={{ width: "100%", height: "100%", borderRadius: 12 }}
    />
  );
};

export default memo(CustomImage);
