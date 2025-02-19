import { topics } from "@/constants/topics"
import { type section } from "@/types/types"
import { View, Text, Pressable } from "react-native"

type props = {
	section: section
	topicHandler: React.Dispatch<React.SetStateAction<string>>
	topicSelectedHandler: React.Dispatch<React.SetStateAction<boolean>>
}
export default function Section({
	section,
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
					}}
				>
					<Text>{topics[topic]}</Text>
				</Pressable>
			))}
		</View>
	)
}
