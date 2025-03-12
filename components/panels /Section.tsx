import { topics } from "@/constants/topics"
import { type section } from "@/types/types"
import { View, Pressable } from "react-native"
import StyledText from "../StyledText"

type props = {
	section: section
	subjectHandler?: () => void
	topicHandler: React.Dispatch<React.SetStateAction<string>>
	topicSelectedHandler: React.Dispatch<React.SetStateAction<boolean>>
	topic: string
}
export default function Section({
	section,
	subjectHandler,
	topicHandler,
	topicSelectedHandler,
	topic: currentTopic,
}: props) {
	return (
		<View className="gap-3">
			{section.map((topic, index) => (
				<Pressable
					key={index}
					onPress={() => {
						topicHandler(topic)
						topicSelectedHandler(true)
						if (subjectHandler) {
							subjectHandler()
						}
					}}
					className={`rounded-xl p-4 ${
						currentTopic === topic ? "bg-primary" : "bg-secondary"
					}`}
				>
					<StyledText
						className={`text-xl text-right ${
							currentTopic === topic
								? "text-background"
								: "text-text"
						}`}
					>
						{topics[topic]}
					</StyledText>
				</Pressable>
			))}
		</View>
	)
}
