import { type questionInfo } from "@/types/types"
import { useState } from "react"
import { View, Text } from "react-native"

type questionsByExam = {
	[key: number]: { name: string; id: number; questions: questionInfo[] }
}
type questions = {
	name: string
	id: number
	questions: questionInfo[]
}
type props = {
	questionsByExam: questionsByExam
}
type percentage = {
	name: string
	id: number
	percentage: number
}

export default function AnalyticsBox({ questionsByExam }: props) {
	const [percentages, setPercentages] = useState<percentage[]>([])
	const [wrongQuestions, setWrongQuestions] = useState<questions[]>([])

	const [questionsCount, setQuestionsCount] = useState(0)
	const [correctQuestionsCount, setCorrectQuestionsCount] = useState(0)
	const [wrongQuestionsCount, setWrongQuestionsCount] = useState(0)

	const analyzeExams = () => {
		for (const [examId, examInfo] of Object.entries(questionsByExam)) {
			let examQuestionsCount = 0
			let examCorrectQuestionsCount = 0
			let examWrongQuestionsCount = 0
			const examWrongQuestions: questions = {
				name: examInfo.name,
				id: examInfo.id,
				questions: [],
			}
			examInfo.questions.map((question) => {
				examQuestionsCount += 1
				setQuestionsCount((prev) => prev + 1)
				switch (question.status) {
					case "CORRECT":
						examCorrectQuestionsCount += 1
						setCorrectQuestionsCount((prev) => prev + 1)
					case "WRONG":
						examWrongQuestionsCount += 1
						examWrongQuestions.questions.push(question)
						setWrongQuestionsCount((prev) => prev + 1)
				}
			})
			const examPercentage =
				((examCorrectQuestionsCount * 3 - examWrongQuestionsCount) /
					(examQuestionsCount * 3)) *
				100
			setPercentages([
				...percentages,
				{
					name: examInfo.name,
					id: examInfo.id,
					percentage: examPercentage,
				},
			])
			setWrongQuestions([...wrongQuestions, examWrongQuestions])
		}
	}

	return (
		<View>
			{percentages.map((exam) => (
				<Text>
					{exam.id} {exam.name} {exam.percentage}
				</Text>
			))}
		</View>
	)
}
