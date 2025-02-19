import { physicsLayout } from "@/constants/layouts"
import {
	type section,
	type questionInfo,
	type questionStatus,
} from "@/types/types"
import { useEffect, useState } from "react"
import TopicList from "./TopicSelector"
import { View, Text } from "react-native"
import StatusSelector from "./StatusSelector"

type props = {
	storeHandler: (questionData: questionInfo) => Promise<void>
	questionNumber: string
	examId: string
}

export default function PhysicsPanel({
	storeHandler,
	questionNumber,
	examId,
}: props) {
	const [currentTab, setCurrentTab] = useState("12")
	const [sections, setSections] = useState<section[]>(
		physicsLayout[2].sections
	)
	const [topic, setTopic] = useState("")
	const [isTopicChosen, setIsTopicChosen] = useState(false)
	const [status, setStatus] = useState<questionStatus>("CORRECT")

	const callStoreHandler = () => {
		const questionData: questionInfo = {
			number: +questionNumber,
			status,
			subject: "PHYSICS",
			// @ts-ignore
			topic,
			examId: +examId,
		}
		storeHandler(questionData)
	}

	useEffect(() => {
		physicsLayout.map((tab) => {
			if (tab.name === currentTab) {
				setSections(tab.sections)
			}
		})
	}, [currentTab])

	return (
		<View>
			{isTopicChosen ? (
				<StatusSelector
					statusHandler={setStatus}
					storeHandler={callStoreHandler}
				/>
			) : (
				<TopicList
					layout={physicsLayout}
					tabHandler={setCurrentTab}
					sections={sections}
					topicHandler={setTopic}
					topicChosenHandler={setIsTopicChosen}
				/>
			)}
		</View>
	)
}
