
import { safeHaptic } from "@/utils/safeHaptics";
import { useRef } from "react";
import { useSharedValue, withTiming } from "react-native-reanimated";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { OrderItem } from "../types/orderItem";

type Props = {
    item:OrderItem;

    img: string;
    quantity: number;

};


export const useQuantityHandlers = ({

    item,
    quantity,
  
    img,


}: Props) => {
    const pressedLong = useRef(false);
    const addItem = useCreateOrderStore((s) => s.addItem);
    const increase = useCreateOrderStore((s) => s.increase);
    const decrease = useCreateOrderStore((s) => s.decrease);
    const removeItem = useCreateOrderStore((s) => s.removeItem);
    const btnScale = useSharedValue(1);
    const qtyScale = useSharedValue(1);
    const addScale = useSharedValue(1);

    const ANIM_DURATION = 100;

    const handleIncrease = () => {
        if (pressedLong.current) {
            pressedLong.current = false;
            return;
        }
        increase(item.codart);

        safeHaptic("selection");
        btnScale.value = withTiming(
            0.9,
            { duration: ANIM_DURATION },
            () => (btnScale.value = 1)
        );
        qtyScale.value = withTiming(
            1.1,
            { duration: ANIM_DURATION },
            () => (qtyScale.value = 1)
        );
    };
    const handleIncreaseQty = (qty?: number, qtyInStore?: number) => {
        if (pressedLong.current) {
            pressedLong.current = false;
            return;
        }

        const newQty =
            qty !== undefined
                ? qty
                : qtyInStore !== undefined
                    ? qtyInStore
                    : quantity + 1;


        const finalQty =
            item.available !== undefined ? Math.min(newQty, item.available) : newQty;


        const diff = finalQty - quantity;

        if (diff !== 0) {
            increase(item.codart, diff);
        }

        safeHaptic("selection");

        btnScale.value = withTiming(
            0.9,
            { duration: ANIM_DURATION },
            () => (btnScale.value = 1)
        );

        qtyScale.value = withTiming(
            1.1,
            { duration: ANIM_DURATION },
            () => (qtyScale.value = 1)
        );
    };


    const handleDecrease = () => {
        if (pressedLong.current) {
            pressedLong.current = false;
            return;
        }
        decrease(item.codart);
        safeHaptic("selection");
        btnScale.value = withTiming(
            0.9,
            { duration: ANIM_DURATION },
            () => (btnScale.value = 1)
        );
    };

    const handleAdd = () => {
        if (pressedLong.current) {
            pressedLong.current = false;
            return;
        }
    
        addItem({
            ...item,img, quantity: 1, discount: ""
        });
        safeHaptic("selection");
        addScale.value = withTiming(
            1.1,
            { duration: ANIM_DURATION },
            () => (addScale.value = 1)
        );
    };
    const handleRemove = (codart: string) => {
        pressedLong.current = true;
        removeItem(codart);
        safeHaptic("warning");
    };
    const handleMaxIncrease = (codart: string) => {
        pressedLong.current = true;
        if (item.available && item.available > quantity) {
            increase(codart, item.available - quantity);
            safeHaptic("success");
            qtyScale.value = withTiming(
                1.1,
                { duration: ANIM_DURATION },
                () => (qtyScale.value = 1)
            );
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
        handleIncreaseQty,

    };
};
