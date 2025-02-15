import { Text, View } from "react-native"
import { useLocalSearchParams } from "expo-router"

export default function Exam() {
	const { id } = useLocalSearchParams()

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Text>Exam Page - {id}</Text>
		</View>
	)
}
