import {
	type questionInfo,
	type percentage,
	type questions,
	type analyticsInfo,
} from "@/types/types"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { View, Pressable } from "react-native"
import StyledText from "../StyledText"
//@ts-ignore
import PN from "persian-number"

type questionsByExam = {
	[key: number]: { name: string; id: number; questions: questionInfo[] }
}
type props = {
	questionsByExam: questionsByExam
	title: string
	analyticsHandler: React.Dispatch<
		React.SetStateAction<analyticsInfo | undefined>
	>
	modalVisibilityHandler: React.Dispatch<React.SetStateAction<boolean>>
	modalModeHandler: () => void
} & (
	| {
			background?: never
			variation?: never
			direction?: never
	  }
	| {
			questionsByExam: questionsByExam
			title: string
			analyticsHandler: React.Dispatch<
				React.SetStateAction<analyticsInfo | undefined>
			>
			modalVisibilityHandler: React.Dispatch<
				React.SetStateAction<boolean>
			>
			modalModeHandler: React.Dispatch<
				React.SetStateAction<"SUBJECT" | "TOPIC">
			>
			background: "PRIMARY" | "SECONDARY"
			variation: "SMALL"
			direction: "COLUMN" | "ROW"
	  }
)

export default function AnalyticsBox({
	questionsByExam,
	title,
	analyticsHandler,
	modalVisibilityHandler,
	modalModeHandler,
	background = "SECONDARY",
	variation,
	direction,
}: props) {
	const [percentages, setPercentages] = useState<percentage[]>([])
	const [averagePercentage, setAveragePercentage] = useState(0)
	const [reviewQuestions, setWrongQuestions] = useState<questions[]>([])

	const [questionsCount, setQuestionsCount] = useState(0)
	const [correctQuestionsCount, setCorrectQuestionsCount] = useState(0)
	const [wrongQuestionsCount, setWrongQuestionsCount] = useState(0)

	const [isSingleExam, setIsSingleExam] = useState(true)
	const [isModalVisible, setIsModalVisible] = useState(false)

	const analyzeExams = () => {
		setPercentages([])
		setAveragePercentage(0)
		setWrongQuestions([])
		setQuestionsCount(0)
		setCorrectQuestionsCount(0)
		setWrongQuestionsCount(0)

		let questionsCount = 0
		let correctQuestionsCount = 0
		let wrongQuestionsCount = 0

		const percentages: percentage[] = []
		let percentageSum = 0
		const reviewQuestions: questions[] = []

		setIsSingleExam(true)

		for (const [examId, examInfo] of Object.entries(questionsByExam)) {
			if (examInfo.questions.length > 0) {
				let examQuestionsCount = 0
				let examCorrectQuestionsCount = 0
				let examWrongQuestionsCount = 0
				const examReviewQuestions: questions = {
					name: examInfo.name,
					id: examInfo.id,
					questions: [],
				}
				examInfo.questions.map((question) => {
					examQuestionsCount += 1
					questionsCount += 1
					switch (question.status) {
						case "CORRECT":
							examCorrectQuestionsCount += 1
							correctQuestionsCount += 1
							break
						case "WRONG":
							examWrongQuestionsCount += 1
							wrongQuestionsCount += 1
							examReviewQuestions.questions.push(question)
							break
						case "UNANSWERED":
							examReviewQuestions.questions.push(question)
							break
					}
				})
				const examPercentage =
					((examCorrectQuestionsCount * 3 - examWrongQuestionsCount) /
						(examQuestionsCount * 3)) *
					100
				percentages.push({
					name: examInfo.name,
					id: examInfo.id,
					percentage: Math.floor(examPercentage),
				})
				percentageSum += Math.floor(examPercentage)
				reviewQuestions.push(examReviewQuestions)
			}
		}

		setQuestionsCount(questionsCount)
		setCorrectQuestionsCount(correctQuestionsCount)
		setWrongQuestionsCount(wrongQuestionsCount)
		setPercentages(percentages)
		setAveragePercentage(Math.floor(percentageSum / percentages.length))
		setWrongQuestions(reviewQuestions)
		if (percentages.length > 1) {
			setIsSingleExam(false)
		}
	}

	useFocusEffect(
		useCallback(() => {
			analyzeExams()
		}, [questionsByExam])
	)

	return (
		<Pressable
			onPress={() => {
				modalModeHandler()
				modalVisibilityHandler(true)
				analyticsHandler({
					title,
					questionsCount,
					correctQuestionsCount,
					wrongQuestionsCount,
					percentages,
					averagePercentage,
					reviewQuestions,
				})
			}}
			className={`rounded-xl p-4 grow flex-1 gap-4 ${
				background === "SECONDARY" ? "bg-secondary" : "bg-primary"
			}`}
		>
			<View
				className={`justify-between items-center ${
					direction === "ROW" ? "flex-row-reverse" : "flex-col gap-3"
				}`}
			>
				<StyledText
					className={`text-2xl font-bold ${
						background === "SECONDARY"
							? "text-text"
							: "text-background"
					}`}
				>
					{title}
				</StyledText>
				<StyledText
					className={`text-xl font-bold ${
						background === "SECONDARY"
							? "text-text"
							: "text-secondary"
					}`}
				>
					{percentages.length !== 0
						? PN.convertEnToPe(averagePercentage) + "%"
						: "-"}
				</StyledText>
			</View>
			{variation !== "SMALL" && (
				<View className="flex-row-reverse items-center justify-between gap-4">
					<View className="bg-background/50 p-3 rounded-xl items-center gap-1 grow">
						<StyledText className="text-text">درست</StyledText>
						<StyledText className="text-accent text-xl">
							{PN.convertEnToPe(correctQuestionsCount)}
						</StyledText>
					</View>
					<View className="bg-background/50 p-3 rounded-xl items-center gap-1 grow">
						<StyledText className="text-text ">نادرست</StyledText>
						<StyledText className="text-error text-xl">
							{PN.convertEnToPe(wrongQuestionsCount)}
						</StyledText>
					</View>
					<View className="bg-background/50 p-3 rounded-xl items-center gap-1 grow">
						<StyledText className="text-text ">نزده</StyledText>
						<StyledText className="text-text text-xl">
							{PN.convertEnToPe(
								questionsCount -
									correctQuestionsCount -
									wrongQuestionsCount
							)}
						</StyledText>
					</View>
				</View>
			)}
		</Pressable>
	)
}
