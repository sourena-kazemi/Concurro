import { useLocalSearchParams } from "expo-router"
import { Text, View } from "react-native"
import AnalyticsViewer from "@/components/analytics/AnalyticsViewer"

export default function Analytics() {
	return (
		<View className="flex-1 justify-center items-center w-full bg-background">
			<AnalyticsViewer examId="*" />
		</View>
	)
}
