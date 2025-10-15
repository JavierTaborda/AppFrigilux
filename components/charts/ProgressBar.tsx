import { useThemeStore } from "@/stores/useThemeStore";
import { appColors } from "@/utils/colors";
import * as Progress from "react-native-progress";
interface Props {
  progress: number;
  color?: string;
}
export default function ProgressBar({ progress, color }: Props) {
  const { isDark } = useThemeStore();
  if (!color)
    color = isDark ? appColors.dark.primary.DEFAULT : appColors.primary.DEFAULT;
  return (
    <Progress.Bar
      progress={progress}
      width={null}
      animated={true}
      color={color}
      borderRadius={4}
      borderWidth={0}
      unfilledColor={isDark ? appColors.dark.muted : appColors.muted}
      height={8}
      style={{ marginTop: 1 }}
    />
  );
}
