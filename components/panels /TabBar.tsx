import { type layout } from "@/types/types"
import { Pressable, View } from "react-native"

type props = {
	layout: layout
	tabHandler: React.Dispatch<React.SetStateAction<string>>
}
export default function TabBar({ layout, tabHandler }: props) {
	return (
		<View className="flex-row">
			{layout.map((tab) => (
				<Pressable onPress={() => tabHandler(tab.name)}>
					{tab.previewName}
				</Pressable>
			))}
		</View>
	)
}
