import TabBar from "./TabBar"
import Section from "./Section"
import { layout, section } from "@/types/types"
import { Button, View } from "react-native"
import { useState } from "react"

type props = {
	layout: layout
	tabHandler: React.Dispatch<React.SetStateAction<string>>
	sections: section[]
	topicHandler: React.Dispatch<React.SetStateAction<string>>
	topicChosenHandler: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TopicList({
	layout,
	tabHandler,
	sections,
	topicHandler,
	topicChosenHandler,
}: props) {
	const [isTopicSelected, setIsTopicSelected] = useState(false)

	return (
		<View>
			<TabBar layout={layout} tabHandler={tabHandler} />
			<View className="space-y-2">
				{sections.map((section, index) => (
					<Section
						section={section}
						topicHandler={topicHandler}
						topicSelectedHandler={setIsTopicSelected}
						key={index}
					/>
				))}
			</View>
			<Button
				title="Next"
				disabled={!isTopicSelected}
				onPress={() => topicChosenHandler(true)}
			/>
		</View>
	)
}
