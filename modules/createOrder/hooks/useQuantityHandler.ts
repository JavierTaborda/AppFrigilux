
import { safeHaptic } from "@/utils/safeHaptics";
import { useRef } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";

type Props = {
    quantity: number;
    available?: number;
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
    onMaxIncrease: () => void;
    onAdd: () => void;
};

export const useQuantityHandlers = ({
    quantity,
    available,
    onIncrease,
    onDecrease,
    onRemove,
    onMaxIncrease,
    onAdd,
}: Props) => {
    const pressedLong = useRef(false);

    const btnScale = useSharedValue(1);
    const qtyScale = useSharedValue(1);
    const addScale = useSharedValue(1);

    const ANIM_DURATION = 100;

    const handleIncrease = () => {
        if (pressedLong.current) {
            pressedLong.current = false;
            return;
        }
        onIncrease();
        safeHaptic("selection");
        btnScale.value = withTiming(0.9, { duration: ANIM_DURATION }, () => (btnScale.value = 1));
        qtyScale.value = withTiming(1.1, { duration: ANIM_DURATION }, () => (qtyScale.value = 1));
    };

    const handleDecrease = () => {
        if (pressedLong.current) {
            pressedLong.current = false;
            return;
        }
        onDecrease();
        safeHaptic("selection");
        btnScale.value = withTiming(0.9, { duration: ANIM_DURATION }, () => (btnScale.value = 1));
    };

    const handleAdd = () => {
        if (pressedLong.current) {
            pressedLong.current = false;
            return;
        }
        onAdd();
        safeHaptic("selection");
        addScale.value = withTiming(1.1, { duration: ANIM_DURATION }, () => (addScale.value = 1));
    };

    const handleRemove = () => {
        pressedLong.current = true;
        onRemove();
        safeHaptic("warning");
    };

    const handleMaxIncrease = () => {
        pressedLong.current = true;
        if (available && available > quantity) {
            onMaxIncrease();
            safeHaptic("success");
            qtyScale.value = withTiming(1.1, { duration: ANIM_DURATION }, () => (qtyScale.value = 1));
        }
    };

    return {
        pressedLong,
        btnScale,
        qtyScale,
        addScale,
        handleIncrease,
        handleDecrease,
        handleAdd,
        handleRemove,
        handleMaxIncrease,
    };
};
