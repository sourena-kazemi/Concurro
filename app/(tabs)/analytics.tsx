import { useLocalSearchParams } from "expo-router"
import { Text, View } from "react-native"
import AnalyticsViewer from "@/components/analytics/AnalyticsViewer"

export default function Analytics() {
	return (
		<View className="flex-1 w-full bg-background px-4">
			<AnalyticsViewer examId="*" title="All" />
		</View>
	)
}
