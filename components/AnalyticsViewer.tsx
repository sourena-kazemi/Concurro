import { type examInfo, type questionInfo } from "@/types/types"
import { useFocusEffect } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useState } from "react"
import { View, Text } from "react-native"

type props = {
	examId: string
}
type exam = {
	id: number
	name: string
}

export default function AnalyticsViewer({ examId }: props) {
	const db = useSQLiteContext()

	const [exams, setExams] = useState<exam[]>([])
	const [questions, setQuestions] = useState<questionInfo[]>([])

	const fetchExam = async () => {
		const result = await db.getFirstSync<examInfo>(
			"SELECT * FROM exams WHERE id = ?",
			examId
		)
		if (result) {
			setExams([{ id: result.id, name: result.name }])
		}
	}
	const fetchAllExams = async () => {
		const result = await db.getAllAsync<examInfo>("SELECT * FROM exams")
		const exams: exam[] = []
		result.map((exam) => exams.push({ id: exam.id, name: exam.name }))
		setExams(exams)
	}

	const fetchExamQuestions = async () => {
		const result = await db.getAllAsync<questionInfo>(
			"SELECT * FROM questions WHERE exam = ?",
			examId
		)
		setQuestions(result)
	}
	const fetchAllQuestions = async () => {
		const result = await db.getAllAsync<questionInfo>(
			"SELECT * FROM questions"
		)
		setQuestions(result)
	}

	useFocusEffect(
		useCallback(() => {
			console.log(examId)
			if (examId !== "*") {
				fetchExam()
				fetchExamQuestions()
			} else {
				fetchAllExams()
				fetchAllQuestions()
			}
		}, [examId])
	)
	return (
		<View>
			{questions.map((question) => (
				<Text className="text-text">
					{question.exam}, {question.number}, {question.status}
				</Text>
			))}
		</View>
	)
}
