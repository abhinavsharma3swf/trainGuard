import {useDashboardData} from "@/context/DashboardDataContext";
import {ScrollView, View} from "react-native";
import {BottomNav} from "@/components/BottomNav";
import {RecoveryHistoryCard} from "@/components/RecoveryHistoryCard";
import {useEffect, useState} from "react";
import {getRecoveryHistory, RecoveryHistoryItem} from "@/services/recoveryHistoryApi";

export default function History() {


    const [recoveryHistory, setRecoveryHistory] = useState<RecoveryHistoryItem[]>([])

    useEffect(() => {
        getRecoveryHistory(1,10).then(setRecoveryHistory).catch(error =>console.error(error))
    })
    return (
        <View>
            <ScrollView>
                <View style={styles.activityList}>

                    {recoveryHistory.map((item) => {
                        return (
                            <RecoveryHistoryCard
                                key={item.checkinId}
                                item={{
                                    checkinId: 1,
                                    createdAt: item.createdAt,
                                    painScore: item.painScore ?? 0,
                                    painLocation: item.painLocation,
                                    rpe: item.rpe ?? 0,
                                    mood: item.mood,
                                    note: item.note,
                                    sportType: item.sportType
                                }}/>
                        );
                    })}
                </View>
            </ScrollView>
            <BottomNav activeRoute={"history"}/>
        </View>

    )
}

const styles = {
    activityList: {
        gap: 14,
    },
};