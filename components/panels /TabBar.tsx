import { type layout } from "@/types/types"
import { Pressable, View, Text } from "react-native"

type props = {
	layout: layout
	tabHandler: React.Dispatch<React.SetStateAction<string>>
}
export default function TabBar({ layout, tabHandler }: props) {
	return (
		<View className="flex-row gap-x-2">
			{layout.map((tab, index) => (
				<Pressable key={index} onPress={() => tabHandler(tab.name)}>
					<Text>{tab.previewName}</Text>
				</Pressable>
			))}
		</View>
	)
}
