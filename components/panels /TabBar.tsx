import { type layout } from "@/types/types"
import { useState } from "react"
import { Pressable, View, Text } from "react-native"

type props = {
	layout: layout
	tabHandler: React.Dispatch<React.SetStateAction<string>>
	tab: string
}
export default function TabBar({ layout, tabHandler, tab: currentTab }: props) {
	return (
		<View className="flex flex-row gap-3 w-full items-center">
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
					<Text
						className={`text-center text-xl ${
							currentTab === tab.name
								? "text-primary"
								: "text-background"
						}`}
					>
						{tab.previewName}
					</Text>
				</Pressable>
			))}
		</View>
	)
}
