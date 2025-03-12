import { type layout } from "@/types/types"
import { Pressable, View } from "react-native"
import StyledText from "../StyledText"

type props = {
	layout: layout
	tabHandler: React.Dispatch<React.SetStateAction<string>>
	tab: string
}
export default function TabBar({ layout, tabHandler, tab: currentTab }: props) {
	return (
		<View className="flex flex-row-reverse gap-3 w-full items-center">
			{layout.map((tab, index) => (
				<Pressable
					key={index}
					onPress={() => tabHandler(tab.name)}
					className={`rounded-xl flex flex-grow p-1 ${
						currentTab === tab.name
							? "bg-background border-2 border-primary"
							: "bg-primary"
					}`}
				>
					<StyledText
						className={`text-center text-xl ${
							currentTab === tab.name
								? "text-primary"
								: "text-background"
						}`}
					>
						{tab.previewName}
					</StyledText>
				</Pressable>
			))}
		</View>
	)
}
