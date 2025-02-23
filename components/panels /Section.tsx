import { topics } from "@/constants/topics"
import { type section } from "@/types/types"
import { View, Text, Pressable } from "react-native"

type props = {
	section: section
	subjectHandler?: () => void
	topicHandler: React.Dispatch<React.SetStateAction<string>>
	topicSelectedHandler: React.Dispatch<React.SetStateAction<boolean>>
}
export default function Section({
	section,
	subjectHandler,
	topicHandler,
	topicSelectedHandler,
}: props) {
	return (
		<View>
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
				>
					<Text>{topics[topic]}</Text>
				</Pressable>
			))}
		</View>
	)
}
