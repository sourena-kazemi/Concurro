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
		<View className="flex-row gap-3 w-full flex ">
			{layout.map((tab, index) => (
				<Pressable
					key={index}
					onPress={() => tabHandler(tab.name)}
					className={`rounded-xl flex-grow ${
						currentTab === tab.name ? "bg-text" : "bg-primary"
					}`}
				>
					<Text className="text-center text-xl p-1">
						{tab.previewName}
					</Text>
				</Pressable>
			))}
		</View>
	)
}
