import SearchBar from "@/components/ui/SearchBar";
import TitleText from "@/components/ui/TitleText";
import { useState } from "react";
import { FlatList, View } from "react-native";
import OrderApprovalCard from "../components/OrderApprovalCard";
import { useAuthPays } from "../hooks/useOrdersApproval";

export default function OrderApprovalScreen() {
    const { ordersAproval, loading } = useAuthPays();
    const [searchText, setSearchText] = useState<string>('');

    return (
        <>


            <View className="flex-1 bg-primary dark:bg-dark-primary pt-4 gap-3">
                <TitleText
                    title={` Pedidos`}
                    subtitle={`Total 1000 $`}
                />

                <View className="flex-1 bg-background dark:bg-dark-background rounded-t-3xl gap-4 px-4 pt-4 shadow-lg">
                    {/* bar search and filter button */}
                    <View className="flex-row overflow-hidden p-1">
                        <View className="w-4/5">
                            <SearchBar
                                searchText={searchText}
                                setSearchText={setSearchText}
                                placeHolderText=""
                            />
                        </View>
                        {/* <View className="w-1/5 justify-center items-end">
                            <TouchableOpacity
                                className="mx-1 px-6 py-2.5 bg-componentbg dark:bg-dark-componentbg rounded-full"
                                onPress={() => setFilterModalVisible(true)}
                            >
                                <Ionicons name="filter" size={20} color={theme === 'dark' ? 'white' : 'grey'} />
                            </TouchableOpacity>
                        </View> */}
                    </View>

                    {/*  List */}
                    <FlatList
                        data={ordersAproval}
                        keyExtractor={(item, index) => `${item.fact_num}-${index}`}
                        renderItem={({ item }) => (
                            <OrderApprovalCard item={item} />
                        )}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />
                </View>
            </View>
        </>
    );
}