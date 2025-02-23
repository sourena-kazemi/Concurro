import { topics } from "@/constants/topics"
import { type section } from "@/types/types"
import { View, Text, Pressable } from "react-native"

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
					<Text
						className={`text-xl ${
							currentTopic === topic
								? "text-background"
								: "text-text"
						}`}
					>
						{topics[topic]}
					</Text>
				</Pressable>
			))}
		</View>
	)
}
