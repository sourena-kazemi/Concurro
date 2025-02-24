import { mathLayout } from "@/constants/layouts"
import {
	type questionInfo,
	type questionStatus,
	type section,
} from "@/types/types"
import { useEffect, useState } from "react"
import TopicSelector from "./TopicSelector"
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
	const [subject, setSubject] = useState("calculus")
	const [sections, setSections] = useState<section[]>(mathLayout[0].sections)
	const [topic, setTopic] = useState("")
	const [isTopicChosen, setIsTopicChosen] = useState(false)
	const [status, setStatus] = useState<questionStatus>("CORRECT")

	const callStoreHandler = () => {
		const questionData: questionInfo = {
			number: +questionNumber,
			status,
			// @ts-ignore
			subject: subject.toUpperCase(),
			// @ts-ignore
			topic,
			examId: +examId,
		}
		storeHandler(questionData)
	}

	const updateSubject = () => {
		setSubject(currentTab)
	}

	useEffect(() => {
		mathLayout.map((tab) => {
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
					status={status}
					storeHandler={callStoreHandler}
				/>
			) : (
				<TopicSelector
					layout={mathLayout}
					tabHandler={setCurrentTab}
					tab={currentTab}
					sections={sections}
					subjectHandler={updateSubject}
					topicHandler={setTopic}
					topic={topic}
					topicChosenHandler={setIsTopicChosen}
				/>
			)}
		</View>
	)
}
