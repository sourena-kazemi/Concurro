import TabBar from "./TabBar"
import Section from "./Section"
import { layout, section } from "@/types/types"
import { Pressable, View } from "react-native"
import { useState } from "react"
import StyledText from "../StyledText"

type props = {
	layout: layout
	tabHandler: React.Dispatch<React.SetStateAction<string>>
	tab: string
	sections: section[]
	subjectHandler?: () => void
	topicHandler: React.Dispatch<React.SetStateAction<string>>
	topic: string
	topicChosenHandler: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TopicSelector({
	layout,
	tabHandler,
	tab,
	sections,
	subjectHandler,
	topicHandler,
	topic,
	topicChosenHandler,
}: props) {
	const [isTopicSelected, setIsTopicSelected] = useState(false)

	return (
		<View className="gap-6">
			<TabBar layout={layout} tabHandler={tabHandler} tab={tab} />
			<View className="gap-6">
				{sections.map((section, index) => (
					<Section
						section={section}
						subjectHandler={subjectHandler}
						topicHandler={topicHandler}
						topicSelectedHandler={setIsTopicSelected}
						topic={topic}
						key={index}
					/>
				))}
			</View>
			<Pressable
				disabled={!isTopicSelected}
				onPress={() => topicChosenHandler(true)}
				className={`p-3 rounded-xl
				${isTopicSelected ? "bg-accent" : "bg-text opacity-50"}`}
			>
				<StyledText className="text-center text-xl text-background">
					بعدی
				</StyledText>
			</Pressable>
		</View>
	)
}
