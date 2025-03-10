import { chemistryLayout } from "@/constants/layouts"
import {
	type section,
	type questionInfo,
	type questionStatus,
} from "@/types/types"
import { useEffect, useState } from "react"
import TopicSelector from "./TopicSelector"
import { View, Text } from "react-native"
import StatusSelector from "./StatusSelector"

type props = {
	storeHandler: (questionData: questionInfo) => Promise<void>
	questionNumber: string
	examId: string
	answer: number
}

export default function ChemistryPanel({
	storeHandler,
	questionNumber,
	examId,
	answer,
}: props) {
	const [currentTab, setCurrentTab] = useState("memorization")
	const [sections, setSections] = useState<section[]>(
		chemistryLayout[0].sections
	)
	const [topic, setTopic] = useState("")
	const [isTopicChosen, setIsTopicChosen] = useState(false)
	const [status, setStatus] = useState<questionStatus>("CORRECT")

	const callStoreHandler = () => {
		const questionData: questionInfo = {
			number: +questionNumber,
			status,
			subject: "CHEMISTRY",
			// @ts-ignore
			topic,
			examId: +examId,
		}
		storeHandler(questionData)
	}

	useEffect(() => {
		chemistryLayout.map((tab) => {
			if (tab.name === currentTab) {
				setSections(tab.sections)
			}
		})
	}, [currentTab])

	return (
		<View className="w-full">
			{isTopicChosen ? (
				<StatusSelector
					statusHandler={setStatus}
					storeHandler={callStoreHandler}
					answer={answer}
				/>
			) : (
				<TopicSelector
					layout={chemistryLayout}
					tabHandler={setCurrentTab}
					tab={currentTab}
					sections={sections}
					topicHandler={setTopic}
					topic={topic}
					topicChosenHandler={setIsTopicChosen}
				/>
			)}
		</View>
	)
}
