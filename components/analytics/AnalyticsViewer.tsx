import { type subject, type examInfo, type questionInfo } from "@/types/types"
import { useFocusEffect } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useState } from "react"
import { View, Text } from "react-native"
import AnalyticsBox from "./AnalyticsBox"

type props = {
	examId: string
}
type exam = {
	[key: number]: string
}
type sortedQuestions = {
	[key: string]: {
		[key: string]: { name: string; id: number; questions: questionInfo[] }
	}
}

export default function AnalyticsViewer({ examId }: props) {
	const db = useSQLiteContext()

	const [exams, setExams] = useState<exam>({})
	const [questions, setQuestions] = useState<questionInfo[]>([])
	const [questionsBySubject, setQuestionsBySubject] =
		useState<sortedQuestions>({})
	const [questionsByTopic, setQuestionsByTopic] = useState<sortedQuestions>(
		{}
	)

	const sortQuestions = (questions: questionInfo[]) => {
		const questionsBySubject: sortedQuestions = {}
		const questionsByTopic: sortedQuestions = {}

		questions.map((question) => {
			questionsBySubject[question.subject][question.exam].questions.push(
				question
			)
			questionsByTopic[question.topic][question.exam].questions.push(
				question
			)

			const subject = question.subject
			if (
				subject === "CALCULUS" ||
				subject === "DISCRETE" ||
				subject === "GEOMETRY" ||
				subject === "STATISTICS"
			) {
				questionsBySubject["MATHEMATICS"][question.exam].questions.push(
					question
				)
			}
		})
		setQuestionsBySubject(questionsBySubject)
		setQuestionsByTopic(questionsByTopic)
	}

	const fetchExam = async () => {
		const result = await db.getFirstSync<examInfo>(
			"SELECT * FROM exams WHERE id = ?",
			examId
		)
		if (result) {
			setExams({ [result.id]: result.name })
		}
	}
	const fetchAllExams = async () => {
		const result = await db.getAllAsync<examInfo>("SELECT * FROM exams")
		const exams: exam = {}
		result.map((exam) => (exams[exam.id] = exam.name))
		setExams(exams)
	}

	const fetchExamQuestions = async () => {
		const result = await db.getAllAsync<questionInfo>(
			"SELECT * FROM questions WHERE exam = ?",
			examId
		)
		setQuestions(result)
		sortQuestions(result)
	}
	const fetchAllQuestions = async () => {
		const result = await db.getAllAsync<questionInfo>(
			"SELECT * FROM questions"
		)
		setQuestions(result)
		sortQuestions(result)
	}

	useFocusEffect(
		useCallback(() => {
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
			<AnalyticsBox questionsByExam={questionsBySubject["MATHEMATICS"]} />
		</View>
	)
}
