import {
	type subject,
	type examInfo,
	type questionInfo,
	type topic,
} from "@/types/types"
import { chemistryLayout } from "@/constants/layouts"
import { useFocusEffect } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useState } from "react"
import { View, Text, ScrollView } from "react-native"
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

	const sortQuestions = (questions: questionInfo[], exams: exam) => {
		const questionsBySubject: sortedQuestions = {}
		const questionsByTopic: sortedQuestions = {}

		const chemistryMemorizationTopics: topic[] = []
		const chemistryCalculationTopics: topic[] = []

		chemistryLayout[0].sections.map((section) =>
			chemistryMemorizationTopics.push(...section)
		)
		chemistryLayout[1].sections.map((section) =>
			chemistryCalculationTopics.push(...section)
		)

		questions.map((question) => {
			const check = (object: {
				[key: string]: {
					name: string
					id: number
					questions: questionInfo[]
				}
			}) => {
				if (!object) {
					object = {}
				}
				if (!object[question.exam]) {
					object[question.exam] = {
						name: exams[question.exam],
						id: question.exam,
						questions: [],
					}
				}
				return object
			}
			questionsBySubject[question.subject] = check(
				questionsBySubject[question.subject]
			)
			questionsBySubject["MATHEMATICS"] = check(
				questionsBySubject["MATHEMATICS"]
			)
			questionsBySubject["CHEMISTRY_MEMO"] = check(
				questionsBySubject["CHEMISTRY_MEMO"]
			)
			questionsBySubject["CHEMISTRY_CALC"] = check(
				questionsBySubject["CHEMISTRY_CALC"]
			)
			questionsByTopic[question.topic] = check(
				questionsByTopic[question.topic]
			)

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
			if (question.subject === "CHEMISTRY") {
				if (chemistryMemorizationTopics.includes(question.topic)) {
					questionsBySubject["CHEMISTRY_MEMO"][
						question.exam
					].questions.push(question)
				}
				if (chemistryCalculationTopics.includes(question.topic)) {
					questionsBySubject["CHEMISTRY_CALC"][
						question.exam
					].questions.push(question)
				}
			}
		})
		setQuestionsBySubject(questionsBySubject)
		setQuestionsByTopic(questionsByTopic)
	}

	const fetchExamData = async () => {
		const examResult = await db.getFirstSync<examInfo>(
			"SELECT * FROM exams WHERE id = ?",
			examId
		)
		const questionsResult = await db.getAllAsync<questionInfo>(
			"SELECT * FROM questions WHERE exam = ?",
			examId
		)

		if (examResult) {
			setQuestions(questionsResult)
			setExams({ [examResult.id]: examResult.name })
			sortQuestions(questionsResult, { [examResult.id]: examResult.name })
		}
	}

	const fetchAllExamsData = async () => {
		const examsResult = await db.getAllAsync<examInfo>(
			"SELECT * FROM exams"
		)
		const exams: exam = {}
		examsResult.map((exam) => (exams[exam.id] = exam.name))
		const questionsResult = await db.getAllAsync<questionInfo>(
			"SELECT * FROM questions"
		)

		setExams(exams)
		setQuestions(questionsResult)
		sortQuestions(questionsResult, exams)
	}

	useFocusEffect(
		useCallback(() => {
			if (examId !== "*") {
				fetchExamData()
			} else {
				fetchAllExamsData()
			}
		}, [examId])
	)

	return (
		<ScrollView>
			<View className="w-full gap-6 py-20">
				<AnalyticsBox
					questionsByExam={questionsBySubject["MATHEMATICS"] || {}}
					title="MATHEMATICS"
				/>
				<AnalyticsBox
					questionsByExam={questionsBySubject["PHYSICS"] || {}}
					title="PHYSICS"
				/>
				<AnalyticsBox
					questionsByExam={questionsBySubject["CHEMISTRY"] || {}}
					title="CHEMISTRY"
				/>
				<View className="gap-3 mt-6">
					<View className="flex-row gap-3">
						<AnalyticsBox
							questionsByExam={
								questionsBySubject["CALCULUS"] || {}
							}
							title="CALCULUS"
							variation="SMALL"
						/>
						<AnalyticsBox
							questionsByExam={
								questionsBySubject["GEOMETRY"] || {}
							}
							title="GEOMETRY"
							variation="SMALL"
						/>
					</View>
					<View className="flex-row gap-3">
						<AnalyticsBox
							questionsByExam={
								questionsBySubject["DISCRETE"] || {}
							}
							title="DISCRETE"
							variation="SMALL"
						/>
						<AnalyticsBox
							questionsByExam={
								questionsBySubject["STATISTICS"] || {}
							}
							title="STATISTICS"
							variation="SMALL"
						/>
					</View>
				</View>
				<View className="gap-3 mt-6 flex-row">
					<AnalyticsBox
						questionsByExam={
							questionsBySubject["CHEMISTRY_MEMO"] || {}
						}
						title="CHEMISTRY_MEMO"
						variation="SMALL"
					/>
					<AnalyticsBox
						questionsByExam={
							questionsBySubject["CHEMISTRY_CALC"] || {}
						}
						title="CHEMISTRY_CALC"
						variation="SMALL"
					/>
				</View>
			</View>
		</ScrollView>
	)
}
