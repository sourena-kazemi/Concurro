import { mathLayout } from "@/constants/layouts"
import {
	type questionInfo,
	type questionStatus,
	type section,
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

export default function MathPanel({
	storeHandler,
	questionNumber,
	examId,
}: props) {
	const [currentTab, setCurrentTab] = useState("calculus")
	const [sections, setSections] = useState<section[]>(mathLayout[0].sections)
	const [topic, setTopic] = useState("")
	const [isTopicChosen, setIsTopicChosen] = useState(false)
	const [status, setStatus] = useState<questionStatus>("CORRECT")

	const callStoreHandler = () => {
		const questionData: questionInfo = {
			number: +questionNumber,
			status,
			// @ts-ignore
			subject: currentTab.toUpperCase(),
			// @ts-ignore
			topic,
			examId: +examId,
		}
		storeHandler(questionData)
	}

	useEffect(() => {
		mathLayout.map((tab) => {
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
					layout={mathLayout}
					tabHandler={setCurrentTab}
					sections={sections}
					topicHandler={setTopic}
					topicChosenHandler={setIsTopicChosen}
				/>
			)}
		</View>
	)
}
